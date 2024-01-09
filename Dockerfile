FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_USER=app_user
ENV POSTGRES_PASSWORD=app_pass
ENV POSTGRES_DB=app_db

# Aguarde até que o PostgreSQL esteja pronto antes de iniciar o aplicativo
CMD ["sh", "-c", "sleep 10 && npm run start:dev"]
