from http import HTTPStatus

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import json
from pathlib import Path

# Caminhos

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "model_pipeline.joblib"
SCHEMA_PATH = BASE_DIR / "schema" / "schema_pipeline.json"

# Carrega schema
with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
    schema = json.load(f)

pipeline = joblib.load(MODEL_PATH)

app = FastAPI(title="Churn Prediction API")

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
            categoria = "Alto grau de cancelamento"
        elif proba >= 0.6:
            categoria = "Médio grau de cancelamento"
        else:
            categoria = "Baixo grau de cancelamento"
        
        return {
            "probabilidade_churn": round(float(proba), 4),
            "previsao_churn": categoria,
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Prediction failed",
                "message": str(e)
            }
        )

