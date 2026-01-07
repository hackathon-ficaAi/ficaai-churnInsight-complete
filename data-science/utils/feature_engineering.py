from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np

class FeatureEngineeringTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, pais_col='pais', genero_col='genero'):
        self.pais_col = pais_col
        self.genero_col = genero_col
        self.le_pais = LabelEncoder()
        self.le_genero = LabelEncoder()
        
    def fit(self, X, y=None):
        if not hasattr(X, 'columns'):
            raise ValueError("X precisa ser um pandas DataFrame")
        
        X = X.copy()
        self.feature_names_in_ = np.array(X.columns)
        
        # Fit encoders
        self.le_pais.fit(X[self.pais_col].astype(str))
        self.le_genero.fit(X[self.genero_col].astype(str))
        
        # Montar lista de features de saída
        output = list(X.columns).copy()
        
        # Features críticas para recall de churn
        output += ['saldo_zero']  # com 0 saldos
        output += ['baixo_engajamento']  # poucos produtos + inativo
        output += ['produto_unico']  # menor vínculo
        output += ['produtos_excessivos']  # sobrecarga (3-4 produtos)
        output += ['alemanha_flag']  # país com maior churn
        output += ['saldo_por_produto']  # rentabilidade
        output += ['saldo_salario_ratio']  # capacidade de poupança
        output += ['inativo_sem_saldo']  # inativos sem saldo
        output += ['idade_produtos_interacao']  # interação entre idade e qtd produtos
        
        self._output_features = output
        return self
    
    def transform(self, X):
        if not hasattr(self, 'feature_names_in_'):
            raise RuntimeError("Chame fit(X) antes de transform(X)")
        
        X = X.copy()
        
        # Encodings básicos (necessários para flags)
        X[self.pais_col] = X[self.pais_col].astype(str)
        X[self.genero_col] = X[self.genero_col].astype(str)
              
        # 1. Saldo zero 
        if 'saldo' in X.columns:
            X['saldo_zero'] = (X['saldo'] == 0).astype(int)
        
        # 2. Baixo engajamento: 1 produto ou menos + inativo
        if 'num_produtos' in X.columns and 'membro_ativo' in X.columns:
            X['baixo_engajamento'] = (
                (X['num_produtos'] <= 1) & (X['membro_ativo'] == 0)
            ).astype(int)
        
        # 3. Produto único
        if 'num_produtos' in X.columns:
            X['produto_unico'] = (X['num_produtos'] == 1).astype(int)
            X['produtos_excessivos'] = (X['num_produtos'] >= 3).astype(int)
        
        # 4. Alemanha (ajuste o nome conforme dataset: 'alemanha', 'Germany', etc)
        try:
            alemanha_code = self.le_pais.transform(['alemanha'])[0]
            X['alemanha_flag'] = (X[self.pais_col].astype(str) == 'alemanha').astype(int)
        except:
            try:
                X['alemanha_flag'] = (X[self.pais_col].astype(str) == 'Germany').astype(int)
            except:
                X['alemanha_flag'] = 0
        
        # 5. Saldo por produto - valor médio por relacionamento
        if 'saldo' in X.columns and 'num_produtos' in X.columns:
            X['saldo_por_produto'] = X['saldo'] / (X['num_produtos'] + 1)
        
        # 6. Ratio saldo/salário - proporção de poupança
        if 'saldo' in X.columns and 'salario_estimado' in X.columns:
            X['saldo_salario_ratio'] = X['saldo'] / (X['salario_estimado'] + 1)
        
        # 7. Inativo SEM saldo
        if 'membro_ativo' in X.columns and 'saldo' in X.columns:
            X['inativo_sem_saldo'] = (
                (X['membro_ativo'] == 0) & (X['saldo'] == 0)
            ).astype(int)
        
        # 8. Idade x produtos
        if 'idade' in X.columns and 'num_produtos' in X.columns:
            X['idade_produtos_interacao'] = X['idade'] * X['num_produtos']
        
        return X
    
    def get_feature_names_out(self, input_features=None):
        if not hasattr(self, '_output_features'):
            raise RuntimeError("fit() precisa ser chamado antes")
        return np.array(self._output_features)
