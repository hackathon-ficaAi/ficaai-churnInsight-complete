# Dockerfile do Frontend (React + Vite)
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código do projeto
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Roda em modo de desenvolvimento liberando acesso externo (--host)
CMD ["npm", "run", "dev", "--", "--host"]