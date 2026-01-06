FROM python:3.11

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia dependências primeiro (melhor cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código da aplicação
COPY app.py .

# Copia pastas necessárias
COPY models/ ./models/
COPY schema/ ./schema/
COPY utils/ ./utils/

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]