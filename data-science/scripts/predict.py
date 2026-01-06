# %%
import pandas as pd
import mlflow
import json
import joblib

mlflow.set_tracking_uri("http://localhost:5000")
# %%
# Import Modelo

model = mlflow.sklearn.load_model("models:/lgbm_classifier/1")
features = model.feature_names_in_
model
# %%
joblib.dump(model, "..\models\model_pipeline.joblib")
print("\n✓ Pipeline salvo em: ..\models\model_pipeline.joblib")

# %%
# Testando na base de teste

df = pd.read_csv("https://raw.githubusercontent.com/hackathon-ficaAi/churnInsight/refs/heads/main/data/churn_teste.csv")
amostra = df[features].head(10).copy()
amostra
# %%
amostras = amostra.to_dict(orient="records")

with open("amostra.json","w", encoding="utf-8") as f:
    json.dump(amostras, f, indent=2, ensure_ascii=False)
# %%
# Predição
predicao = model.predict_proba(amostra[features])[:,1]
amostra['proba'] = predicao
amostra


# %%
