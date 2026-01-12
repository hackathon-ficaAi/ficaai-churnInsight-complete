# data-science/app.py
from http import HTTPStatus
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime
import pandas as pd
import joblib
import json
import os

# Caminhos
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "model_pipeline.joblib"
SCHEMA_PATH = BASE_DIR / "schema" / "schema_pipeline.json"
CSV_DIR = BASE_DIR / "data"             # usa a pasta existente
CSV_PATH = CSV_DIR / "historico.csv"  # arquivo de histórico

# garante que a pasta exista
CSV_DIR.mkdir(parents=True, exist_ok=True)

# Carrega schema e pipeline
with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
    schema = json.load(f)

pipeline = joblib.load(MODEL_PATH)

app = FastAPI(title="Churn Prediction API")

# Allow CORS so Streamlit (deploy externo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8501",           # ← Mantém para testar localmente
        "http://localhost:8502",           # ← Mantém para testar localmente
        "https://ficaai.streamlit.app",    # ← domínio
        "http://137.131.255.43:5173",       # ← React 
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model (CONTRATO)
class ClientInput(BaseModel):
    pais: str
    genero: str
    idade: int
    num_produtos: int
    membro_ativo: int
    saldo: float
    salario_estimado: float

class Schema(BaseModel):
    schema: dict

class Predict(BaseModel):
    probabilidade_churn: float
    previsao_churn: str

@app.get('/', status_code=HTTPStatus.OK, response_model=Schema)
def read_root():
    return {'schema': schema}

# Healthcheck
@app.get("/health", status_code=HTTPStatus.OK)
def health():
    return {"status": HTTPStatus.OK}

# Schema endpoint
@app.get("/schema", status_code=HTTPStatus.OK)
def get_schema():
    return schema['required_features']

def save_prediction(input_data: dict, proba: float, categoria: str):
    """
    Salva a predição em CSV (mantendo até 1000 linhas).
    Colunas: todas as features + probabilidade_churn + previsao + data_analise
    """
    row = dict(input_data)  # cópia
    row["probabilidade_churn"] = float(proba)
    row["previsao"] = categoria
    row["data_analise"] = datetime.utcnow().isoformat()

    df_new = pd.DataFrame([row])

    if CSV_PATH.exists():
        try:
            df_old = pd.read_csv(CSV_PATH)
            df = pd.concat([df_old, df_new], ignore_index=True)
        except Exception:
            df = df_new
    else:
        df = df_new

    if "data_analise" in df.columns:
        df = df.sort_values(by="data_analise", ascending=False).head(1000)
    else:
        df = df.tail(1000)

    df.to_csv(CSV_PATH, index=False)

# Prediction endpoint
@app.post("/predict", status_code=HTTPStatus.CREATED, response_model=Predict)
def predict(data: ClientInput):
    try:
        data_dict = data.dict()

        # Validação de features
        missing = set(schema["required_features"]) - set(data_dict.keys())
        if missing:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Missing features",
                    "missing_features": list(missing)
                }
            )

        # Garantindo a ordem exata usada no treino
        feature_order = schema["required_features"]
        X = pd.DataFrame([data_dict])[feature_order]

        # Aplica o modelo
        proba = pipeline.predict_proba(X)[0, 1]

        # Classificação
        if proba >= 0.8:
            categoria = "Alto Grau de Cancelamento"
        elif proba >= 0.6:
            categoria = "Médio Grau de Cancelamento"
        else:
            categoria = "Baixo Grau de Cancelamento"

        # salva histórico localmente
        try:
            save_prediction(data_dict, proba, categoria)
        except Exception as e_save:
            print("Erro ao salvar predição:", e_save)

        return {
            "probabilidade_churn": round(float(proba), 4),
            "previsao_churn": categoria,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Prediction failed",
                "message": str(e)
            }
        )

# Stats endpoint lendo o CSV de histórico
@app.get("/stats", status_code=HTTPStatus.OK)
def get_stats(limit: int = 1000):
    """
    Retorna estatísticas básicas calculadas sobre as últimas `limit` predições.
    """
    try:
        if not CSV_PATH.exists():
            return {
                "total_avaliados": 0,
                "total_churn": 0,
                "taxa_churn": 0.0,
                "total_alto_risco": 0,
                "total_medio_risco": 0,
                "total_baixo_risco": 0
            }

        df = pd.read_csv(CSV_PATH)
        if df.empty:
            return {
                "total_avaliados": 0,
                "total_churn": 0,
                "taxa_churn": 0.0,
                "total_alto_risco": 0,
                "total_medio_risco": 0,
                "total_baixo_risco": 0
            }

        if "data_analise" in df.columns:
            df = df.sort_values(by="data_analise", ascending=False).head(limit)
        else:
            df = df.tail(limit)

        total = int(df.shape[0])
        alto = int(df[df["previsao"].str.contains("Alto", na=False)].shape[0]) if "previsao" in df.columns else 0
        medio = int(df[df["previsao"].str.contains("Médio|Medio", na=False)].shape[0]) if "previsao" in df.columns else 0
        churn = alto + medio

        return {
            "total_avaliados": total,
            "total_churn": churn,
            "taxa_churn": round(churn / total, 4) if total > 0 else 0.0,
            "total_alto_risco": alto,
            "total_medio_risco": medio,
            "total_baixo_risco": int(total - churn)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", status_code=HTTPStatus.OK)
def get_history(limit: int = 1000):
    try:
        if not CSV_PATH.exists():
            return JSONResponse(content=[], status_code=200)

        df = pd.read_csv(CSV_PATH)
        if df.empty:
            return JSONResponse(content=[], status_code=200)

        if "data_analise" in df.columns:
            df = df.sort_values(by="data_analise", ascending=False).head(limit)
        else:
            df = df.tail(limit)

        records = df.fillna("").to_dict(orient="records")
        return {"history": records}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download_history", status_code=HTTPStatus.OK)
def download_history():
    if not CSV_PATH.exists():
        raise HTTPException(status_code=404, detail="Arquivo historico.csv não encontrado")
    return FileResponse(path=str(CSV_PATH), media_type="text/csv", filename="historico.csv")
