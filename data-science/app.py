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

# Healthcheck
@app.get("/health")
def health():
    return{"status": "ok"}

# Schema endpoint
@app.get("/schema")
def get_schema():
    return schema

# Prediction endpoint
@app.post("/predict")
def predict(data: ClientInput):
    data_dict = data.dict()

    # validação de features
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

    # aplicando o modelo
    proba = pipeline.predict_proba(X)[0,1]

    if int(proba >= 0.7):
        return {
            "probabilidade_churn": float(proba),
            "previsao_churn": "Chance alta de cancelamento"
        }
    else:
        return {
            "probabilidade_churn": float(proba),
            "previsao_churn": "Chance baixa de cancelamento"
        }