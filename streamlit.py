import sys
from pathlib import Path

project_root = Path(__file__).parent
sys.path.insert(0, str(project_root / "data-science"))

import streamlit as st
import pandas as pd
import joblib
import plotly.express as px
import os

st.set_page_config(
    page_title="Painel de Risco de Churn",
    layout="wide",
    initial_sidebar_state="expanded"
)

@st.cache_resource
def load_model():
    model_path = "data-science/models/model_pipeline.joblib"
    
    if os.path.exists(model_path):
        return joblib.load(model_path)
    else:
        st.error(f"Modelo não encontrado em {model_path}. Verifique se você rodou o script de salvamento.")
        return None

@st.cache_data
def load_data():
    return pd.read_csv("https://raw.githubusercontent.com/hackathon-ficaAi/churnInsight/refs/heads/main/data/churn_teste.csv")

model = load_model()
df_raw = load_data()

if model is not None and df_raw is not None:

    try:
        features = model.feature_names_in_
    except:
        features = ["pais", "genero", "idade", "saldo", "num_produtos", "membro_ativo", "salario_estimado"]

    st.sidebar.title("⚙️ Estratégia de Retenção")
    st.sidebar.markdown("Ajuste a sensibilidade do modelo:")
    
    corte_alto = st.sidebar.slider("Limiar Risco Alto (Ação Imediata)", 0.5, 0.95, 0.80, 0.01)
    corte_medio = st.sidebar.slider("Limiar Risco Médio (Alerta)", 0.3, 0.79, 0.60, 0.01)

    X_input = df_raw[features].copy()
    probs = model.predict_proba(X_input)[:, 1]
    
    df_results = df_raw.copy()
    df_results['probabilidade_churn'] = probs

    def classificar_risco(prob):
        if prob >= corte_alto:
            return '1. Alto Risco 🔴'
        elif prob >= corte_medio:
            return '2. Médio Risco 🟡'
        else:
            return '3. Baixo Risco 🟢'

    df_results['Segmento'] = df_results['probabilidade_churn'].apply(classificar_risco)

    paises_selecionados = st.sidebar.multiselect("Filtrar País", df_results['pais'].unique(), default=df_results['pais'].unique())
    df_view = df_results[df_results['pais'].isin(paises_selecionados)]

    st.sidebar.divider()
    pagina = st.sidebar.radio("📄 Navegação", ["Monitoramento de Risco", "Perfil do Cliente"])

    if pagina == "Monitoramento de Risco":
        
        st.title("📊 Monitoramento de Risco de Evasão")
        st.markdown("### Visão Financeira e Volumetria")

        high_risk_df = df_view[df_view['Segmento'] == '1. Alto Risco 🔴']
        
        kpi1, kpi2, kpi3, kpi4 = st.columns(4)

        with kpi1:
            st.metric("Clientes em Alto Risco", f"{len(high_risk_df)}")
        
        with kpi2:
            valor_risco = high_risk_df['saldo'].sum()
            st.metric("Saldo Total em Risco", f"R$ {valor_risco:,.2f}")
        
        with kpi3:
            media_prob = high_risk_df['probabilidade_churn'].mean()
            st.metric("Probabilidade Média (Topo)", f"{media_prob:.1%}")

        with kpi4:
            perc_base = len(high_risk_df) / len(df_view)
            st.metric("% da Base Afetada", f"{perc_base:.1%}")

        st.divider()

        col_charts_1, col_charts_2 = st.columns([2, 1])

        with col_charts_1:
            st.subheader("Matriz de Priorização (Quem salvar primeiro?)")
            st.caption("Foco: Clientes com **Saldo Alto** e **Probabilidade Alta**.")
            
            fig_scatter = px.scatter(
                df_view,
                x="probabilidade_churn",
                y="saldo",
                color="Segmento",
                hover_data=["id_cliente", "pais", "genero"],
                color_discrete_map={
                    '1. Alto Risco 🔴': '#FF4B4B',
                    '2. Médio Risco 🟡': '#FFA500',
                    '3. Baixo Risco 🟢': '#00CC96'
                },
                labels={"probabilidade_churn": "Probabilidade (Modelo)", "saldo": "Saldo em Conta"}
            )
            fig_scatter.add_vline(x=corte_alto, line_dash="dash", line_color="white", opacity=0.5)
            fig_scatter.add_vline(x=corte_medio, line_dash="dash", line_color="white", opacity=0.5)
            
            st.plotly_chart(fig_scatter, use_container_width=True)

        with col_charts_2:
            st.subheader("Distribuição por Grau")
            df_count = df_view['Segmento'].value_counts().reset_index()
            df_count.columns = ['Segmento', 'Clientes']
            
            fig_bar = px.bar(
                df_count, 
                x='Segmento', 
                y='Clientes', 
                color='Segmento',
                text_auto=True,
                color_discrete_map={
                    '1. Alto Risco 🔴': '#FF4B4B',
                    '2. Médio Risco 🟡': '#FFA500',
                    '3. Baixo Risco 🟢': '#00CC96'
                }
            )
            fig_bar.update_layout(showlegend=False)
            st.plotly_chart(fig_bar, use_container_width=True)

        st.subheader("📋 Lista de Ação: Top Clientes Críticos")
        
        cols_export = ['id_cliente', 'Segmento', 'probabilidade_churn', 'saldo', 'pais', 'genero', 'membro_ativo']
        
        df_export = df_view[cols_export].sort_values(
            by=['probabilidade_churn', 'saldo'], 
            ascending=[False, False]
        )
        
        st.dataframe(
            df_export.head(50).style.format({
                "probabilidade_churn": "{:.2%}",
                "saldo": "R$ {:,.2f}"
            }),
            use_container_width=True
        )

    else:
        
        st.title("🕵️ Perfil do Cliente em Risco")
        st.markdown("Comparativo: Quem são os clientes de **Alto Risco** vs. o **Resto da Base**?")

        df_alto_risco = df_results[df_results['probabilidade_churn'] >= corte_alto]
        df_baixo_risco = df_results[df_results['probabilidade_churn'] < corte_alto]

        if len(df_alto_risco) > 0:
            
            st.subheader("1. Comportamento Financeiro e Demográfico (Médias)")
            
            cols_numericas = ['idade', 'score_credito', 'saldo', 'num_produtos', 'salario_estimado', 'tempo_relacionamento']
            cols_validas = [c for c in cols_numericas if c in df_results.columns]

            media_risco = df_alto_risco[cols_validas].mean()
            media_geral = df_baixo_risco[cols_validas].mean()

            df_comparacao = pd.DataFrame({
                'Média (Alto Risco)': media_risco,
                'Média (Seguros)': media_geral
            })
            
            df_comparacao['Diferença %'] = ((df_comparacao['Média (Alto Risco)'] - df_comparacao['Média (Seguros)']) / df_comparacao['Média (Seguros)']) * 100

            c1, c2, c3, c4 = st.columns(4)
            
            if 'idade' in cols_validas:
                diff_idade = df_comparacao.loc['idade', 'Diferença %']
                c1.metric(
                    label="Idade Média", 
                    value=f"{media_risco['idade']:.1f} anos", 
                    delta=f"{diff_idade:.1f}% vs. Seguros",
                    delta_color="inverse"
                )
                
            if 'saldo' in cols_validas:
                diff_saldo = df_comparacao.loc['saldo', 'Diferença %']
                c2.metric(
                    label="Saldo Médio", 
                    value=f"R$ {media_risco['saldo']:,.0f}", 
                    delta=f"{diff_saldo:.1f}% vs. Seguros"
                )

            if 'num_produtos' in cols_validas:
                diff_prod = df_comparacao.loc['num_produtos', 'Diferença %']
                c3.metric(
                    label="Qtd. Produtos", 
                    value=f"{media_risco['num_produtos']:.1f}", 
                    delta=f"{diff_prod:.1f}% vs. Seguros",
                    delta_color="inverse"
                )
                
            with st.expander("Ver tabela detalhada de médias"):
                st.dataframe(df_comparacao.style.format("{:.2f}"))

            st.subheader("2. Fatores Categóricos Predominantes")
            
            col_cat1, col_cat2 = st.columns(2)
            
            with col_cat1:
                st.markdown("**Localização (País)**")
                fig_pais = px.histogram(
                    df_results, 
                    x='pais', 
                    color='Segmento', 
                    barmode='group',
                    histnorm='percent',
                    color_discrete_map={
                        '1. Alto Risco 🔴': '#FF4B4B',
                        '2. Médio Risco 🟡': '#FFA500',
                        '3. Baixo Risco 🟢': '#00CC96'
                    },
                    title="Distribuição Geográfica Relativa (%)"
                )
                st.plotly_chart(fig_pais, use_container_width=True)
                st.caption("*Nota: O gráfico mostra a porcentagem dentro de cada grupo. Ex: Se a barra vermelha na Alemanha é alta, significa que o grupo de risco tem muitos alemães.*")

            with col_cat2:
                st.markdown("**Gênero**")
                fig_gen = px.histogram(
                    df_results, 
                    x='genero', 
                    color='Segmento', 
                    barmode='group',
                    histnorm='percent',
                    color_discrete_map={
                        '1. Alto Risco 🔴': '#FF4B4B',
                        '2. Médio Risco 🟡': '#FFA500',
                        '3. Baixo Risco 🟢': '#00CC96'
                    },
                    title="Distribuição de Gênero Relativa (%)"
                )
                st.plotly_chart(fig_gen, use_container_width=True)

        else:
            st.warning("Não há clientes no segmento 'Alto Risco' com o corte atual. Tente diminuir a barra de probabilidade.")

else:
    st.info("Aguardando carregamento do modelo ou dados...")