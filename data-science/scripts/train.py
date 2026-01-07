# %%
from utils.feature_engineering import FeatureEngineeringTransformer
# %%
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import model_selection, tree, linear_model, naive_bayes, ensemble, metrics, pipeline
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from feature_engine import encoding, discretisation, outliers, transformation
import joblib
# %%
# 
url = 'https://raw.githubusercontent.com/hackathon-ficaAi/churnInsight/refs/heads/main/data/churn_treino.csv'
df = pd.read_csv(url)
df.head()
# %%
# Variável alvo
target = 'churned'

# Variáveis
cols = df.columns[3:]
features = [col for col in cols if col not in [target]]
features
# %%
X,y = df[features], df[target]
# %%
# SAMPLE

X_train, X_test, y_train, y_test = model_selection.train_test_split(X,y,
                                                                    random_state=42,
                                                                    test_size=0.25,
                                                                    stratify=y)
# %%
print("Taxa variável resposta:",y.mean())
print("Taxa variável resposta Treino:",y_train.mean())
print("Taxa variável resposta Teste:",y_test.mean())
# %%
# EXPLORE 
X_train.isna().sum().sort_values(ascending=False)

# Análise bivariada
df_analise = X_train.copy()
df_analise[target] = y_train
df_analise

feat_num = X_train.select_dtypes(['number']).columns

sumario = df_analise.groupby(by=target)[feat_num].agg(["mean","median"]).T
sumario
# %%
sumario['diff_abs'] = sumario[0] - sumario[1]
sumario['diff_rel'] = sumario[0] / sumario[1]
sumario.sort_values(by=['diff_rel'], ascending=False)
# %%
arvore = tree.DecisionTreeClassifier(random_state=42, max_depth=5)
arvore.fit(X_train[feat_num],y_train)

plt.figure(dpi=700)
tree.plot_tree(arvore, feature_names=X_train[feat_num].columns,
               filled=True,
               class_names= [str(i) for i in arvore.classes_])
# %%
# Olhando para a importância de cada variável
pd.Series(arvore.feature_importances_, index=X_train[feat_num].columns).sort_values(ascending=False)

# %%
feature_importances = (pd.Series(arvore.feature_importances_, index=X_train[feat_num].columns)
                       .sort_values(ascending=False)
                       .reset_index())
feature_importances['acumulada'] = feature_importances[0].cumsum()
feature_importances
# %%
feat_cat = X_train.select_dtypes(["object"]).columns

df_analise_cat = X_train[feat_cat].copy()
df_analise_cat[target] = y_train

def resumo_categorica(var,df=df_analise_cat, target=target):
    tabela = pd.crosstab(df[var], df[target], normalize='columns')
    
    resumo = tabela.copy()
    
    resumo['diff_abs'] = resumo[0] - resumo[1]
    resumo['diff_rel'] = resumo[0] / resumo[1]
    
    return resumo
# %%
resumo_categorica('pais')
# %%
resumo_categorica('genero')
# %%
from scipy.stats import chi2_contingency

def resumo_categorica_global(var, df=df_analise_cat, target=target):
    # Crosstab absoluta (para chi²)
    tabela_abs = pd.crosstab(df[var], df[target])
    
    # Crosstab relativa (para diff)
    tabela_rel = pd.crosstab(df[var], df[target], normalize='columns')
    
    diff_abs = (tabela_rel[0] - tabela_rel[1]).abs().max()
    diff_rel = (tabela_rel[0] / tabela_rel[1]).apply(lambda x: max(x, 1/x)).max()
    
    chi2, p, _, _ = chi2_contingency(tabela_abs)
    
    return pd.Series({
        'max_diff_abs': diff_abs,
        'max_diff_rel': diff_rel,
        'chi2': chi2,
        'p_value': p
    })
# %%
resumo_final = (
    pd.DataFrame(
        {var: resumo_categorica_global(var) for var in feat_cat}
    )
    .T
    .sort_values('chi2', ascending=False)
)
# %%
resumo_final
# %%
X_cat_ohe = pd.get_dummies(X_train[feat_cat], drop_first=True)

arvore_cat = tree.DecisionTreeClassifier(
    random_state=42,
    max_depth=5,
    min_samples_leaf=50
)

arvore_cat.fit(X_cat_ohe, y_train)
# %%
imp_cat = (
    pd.Series(arvore_cat.feature_importances_, index=X_cat_ohe.columns)
    .sort_values(ascending=False)
)

imp_cat_grouped = (
    imp_cat
    .groupby(lambda x: x.rsplit('_')[0])
    .sum()
    .sort_values(ascending=False)
    .reset_index()
)

imp_cat_grouped['acumulada'] = imp_cat_grouped[0].cumsum()
imp_cat_grouped

# %%
# Selecionando as melhores features das categóricas e das numéricas
best_features_cat = (imp_cat_grouped['index']
                     .tolist())
best_features_num = (feature_importances[feature_importances[0] > 0]['index']
                     .tolist())
best_features = best_features_cat + best_features_num
best_features 
# %%
# MODIFY
tree_discretization = discretisation.DecisionTreeDiscretiser(
    variables=best_features_num,
    regression=False,
    bin_output='bin_number',
    cv=3
)

onehot = encoding.OneHotEncoder(
    variables=best_features,
    ignore_format=True,
    drop_last=True
)

# %%
# log1p
log1p = transformation.LogCpTransformer(variables=['saldo'],C=1)
# %%
# MODEL -- 

params_lr = {
    "max_iter":[50,100,200,500],
    "solver":['lbfgs', 'newton-cg', 'newton-cholesky', 'sag', 'saga']
}

params_rf = {
    "n_estimators":[100,200,500,1000],
    "criterion": ['gini', 'entropy', 'log_loss'],
    "min_samples_leaf": [15,20,25,30,40,50],
    "max_depth": [3,6,10,15,20],
    "class_weight":['balanced','balanced_subsample']
}

params_ada = {
    "n_estimators":[50,100,200,500],
    "learning_rate":[0.01,0.02,0.05,0.10,0.20,0.30]
}

params_xgb = {
    "n_estimators":[50,100,200,500,1000],
    "max_depth": [3,5,10,15,20],
    "learning_rate":[0.01,0.02,0.05,0.10,0.15,0.20,0.30]
}

params_lgbm = {
    "learning_rate":[0.01,0.02,0.05,0.10,0.20,0.30],
    "n_estimators":[50,100,200,500,1000]
}

models = [
    (
        linear_model.LogisticRegression(
            class_weight='balanced',
            random_state=42
        ),
        params_lr
    ),
    (
        ensemble.RandomForestClassifier(
            random_state=42,
            n_jobs=-1
        ),
        params_rf
    ),
    (
        ensemble.AdaBoostClassifier(
            random_state=42
        ),
        params_ada
    ),
    (
        XGBClassifier(
            random_state=42
        ),
        params_xgb
    ),
    (
        LGBMClassifier(
            random_state=42,
            class_weight='balanced'
        ),
        params_lgbm
    )
]
# %%
#model = naive_bayes.BernoulliNB()

fe = FeatureEngineeringTransformer()

for model, param in models:
    grid = model_selection.GridSearchCV(model, 
                                        param, 
                                        cv=model_selection.StratifiedKFold(n_splits=5), 
                                        scoring='recall',
                                        verbose=4,
                                        error_score='raise')

    model_pipeline = pipeline.Pipeline(
        steps=[
            ('feature_engineering', fe),
            ('log', log1p),
            ('Discretizar',tree_discretization),
            ('OneHot',onehot),
            ('Grid',grid)
        ]
    )


    import mlflow

    mlflow.set_tracking_uri("http://127.0.0.1:5000/")
    mlflow.set_experiment(experiment_id=1)

    with mlflow.start_run(run_name=model.__str__()):
        mlflow.sklearn.autolog()

        model_pipeline.fit(X_train[best_features],y_train)

        y_train_predict = model_pipeline.predict(X_train[best_features])
        y_train_proba = model_pipeline.predict_proba(X_train[best_features])[:,1]

        # ASSESS
        acc_train = metrics.accuracy_score(y_train, y_train_predict)
        auc_train = metrics.roc_auc_score(y_train,y_train_proba)
        roc_train = metrics.roc_curve(y_train, y_train_proba)
        recall_train = metrics.recall_score(y_train,y_train_predict)
        f1_train = metrics.f1_score(y_train,y_train_predict)
        print("Acurácia Treino:", acc_train)
        print("AUC Treino:",auc_train)
        print("Recall treino:", recall_train)
        print("F1-Score:",f1_train)
        print("\nReport:")
        print(metrics.classification_report(y_train, y_train_predict))

        y_test_predict = model_pipeline.predict(X_test[best_features])
        y_test_proba = model_pipeline.predict_proba(X_test[best_features])[:,1]

        acc_test = metrics.accuracy_score(y_test, y_test_predict)
        auc_test = metrics.roc_auc_score(y_test,y_test_proba)
        roc_test = metrics.roc_curve(y_test, y_test_proba)
        recall_test = metrics.recall_score(y_test,y_test_predict)
        f1_test = metrics.f1_score(y_test,y_test_predict)
        print("Acurácia Teste:", acc_test)
        print("AUC Teste:",auc_test)
        print("Recall Teste:", recall_test)
        print("F1-Score:",f1_test)
        print("\nReport:")
        print(metrics.classification_report(y_test, y_test_predict))

        mlflow.log_metrics({
            "acc_train":acc_train,
            "auc_train":auc_train,
            "acc_test": acc_test,
            "auc_test": auc_test,
            "recall_train": recall_train,
            "recall_test":recall_test,
            "f1_train":f1_train,
            "f1_test":f1_test
        })

# %%
plt.plot(roc_train[0],roc_train[1])
plt.plot(roc_test[0],roc_test[1])
plt.grid(True)
plt.title("Curva ROC")
plt.legend([
    f"Treino: {100*auc_train:.2f}",
    f"Teste: {100*auc_test:.2f}"
])
# %%
# Export
joblib.dump(model_pipeline, "..\models\model_pipeline.joblib")
print("\n✓ Pipeline Regressão Logística salvo em: ..\models\model_pipeline.joblib")
# %%
