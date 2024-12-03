# Imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Prepara o Husky (instala os hooks)
RUN npm run prepare

# Copia o restante dos arquivos do projeto
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta padrão da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]
