from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np

class FeatureEngineeringTransformer(BaseEstimator, TransformerMixin):
    """
    Gera:
      - pais_enc, genero_enc (internos)
      - alemao_mulher
      - idade_x_produtos

    Implementações extras:
      - salva feature_names_in_ no fit
      - expõe get_feature_names_out() com os nomes das colunas de saída
    """

    def __init__(self, pais_col='pais', genero_col='genero'):
        self.pais_col = pais_col
        self.genero_col = genero_col
        self.le_pais = LabelEncoder()
        self.le_genero = LabelEncoder()

    def fit(self, X, y=None):
        # espera um pandas.DataFrame com colunas
        if not hasattr(X, 'columns'):
            raise ValueError("X precisa ser um pandas DataFrame com colunas nomeadas")

        X = X.copy()
        # guarda nomes de entrada
        self.feature_names_in_ = np.array(X.columns)
        input_cols = list(X.columns)

        # fit apenas nas colunas originais (assume pd.DataFrame)
        self.le_pais.fit(X[self.pais_col].astype(str))
        self.le_genero.fit(X[self.genero_col].astype(str))

        # monta nomes de saída esperados (mantém as colunas originais + derivados)
        output = input_cols.copy()
        output += ['pais_enc', 'genero_enc']
        output += ['alemao_mulher']
        if 'membro_ativo' in input_cols:
            output += ['membro_ativo_bin']
        if ('idade' in input_cols) and ('num_produtos' in input_cols):
            output += ['idade_x_produtos']

        self._output_features = output
        return self

    def transform(self, X):
        if not hasattr(self, 'feature_names_in_'):
            raise RuntimeError("Transformer não foi ajustado. Chame fit(X) antes de transform(X).")

        X = X.copy()

        # valida presença das colunas mínimas
        for c in (self.pais_col, self.genero_col):
            if c not in X.columns:
                raise KeyError(f"Coluna necessária '{c}' não encontrada no DataFrame de entrada")

        # garante strings (evita erros)
        X[self.pais_col] = X[self.pais_col].astype(str)
        X[self.genero_col] = X[self.genero_col].astype(str)

        # encodings (mantemos as originais também)
        X['pais_enc'] = self.le_pais.transform(X[self.pais_col])
        X['genero_enc'] = self.le_genero.transform(X[self.genero_col])

        # features derivadas
        # atenção: o valor exato 'alemanha' e 'feminino' deve bater com seu dataset (case)
        try:
            alemanha_code = self.le_pais.transform(['alemanha'])[0]
        except Exception:
            alemanha_code = None

        try:
            feminino_code = self.le_genero.transform(['feminino'])[0]
        except Exception:
            feminino_code = None

        if alemanha_code is not None and feminino_code is not None:
            X['alemao_mulher'] = (
                (X['pais_enc'] == alemanha_code) &
                (X['genero_enc'] == feminino_code)
            ).astype(int)
        else:
            X['alemao_mulher'] = 0

        # membro ativo binário (preserva valor original quando existir)
        if 'membro_ativo' in X.columns:
            X['membro_ativo_bin'] = X['membro_ativo'].astype(int)

        # interação
        if ('idade' in X.columns) and ('num_produtos' in X.columns):
            X['idade_x_produtos'] = X['idade'] * X['num_produtos']

        return X

    def get_feature_names_out(self, input_features=None):
        """Retorna os nomes das features resultantes do transform.
        Se o transformer não foi ajustado, levanta RuntimeError.
        """
        if not hasattr(self, '_output_features'):
            raise RuntimeError("fit() precisa ser chamado antes de get_feature_names_out()")
        return np.array(self._output_features)
