# Use a imagem Node.js versão 18 baseada no Alpine Linux
FROM node:18-alpine

# Defina a variável de ambiente NODE_ENV como desenvolvimento
ENV NODE_ENV=development

# Instale o pacote tzdata para configurar o fuso horário
RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && echo "America/Sao_Paulo" > /etc/timezone \
    && apk del tzdata

# Defina a variável de ambiente TZ
ENV TZ America/Sao_Paulo

# Configure as variáveis de ambiente para o idioma e codificação
ENV LANG pt_BR.UTF-8
ENV LANGUAGE pt_BR.UTF-8
ENV LC_ALL pt_BR.UTF-8

# Instale as dependências necessárias para o suporte a localidade com musl
ENV MUSL_LOCALE_DEPS cmake make musl-dev gcc gettext-dev libintl
ENV MUSL_LOCPATH /usr/share/i18n/locales/musl

RUN apk add --no-cache $MUSL_LOCALE_DEPS \
    && wget https://gitlab.com/rilian-la-te/musl-locales/-/archive/master/musl-locales-master.zip \
    && unzip musl-locales-master.zip \
    && cd musl-locales-master \
    && cmake -DLOCALE_PROFILE=OFF -DCMAKE_INSTALL_PREFIX:PATH=/usr . \
    && make \
    && make install \
    && cd .. \
    && rm -r musl-locales-master

# Copie os arquivos do aplicativo para o diretório de trabalho
WORKDIR /usr/src/app

COPY entrypoint.sh ./
COPY package*.json ./

# Instale as dependências do Node.js
RUN npm install

COPY . .

# Exponha a porta 3000
EXPOSE 3000

RUN chmod +x ./entrypoint.sh

CMD [ "sh", "-c", "sleep 10 && ./entrypoint.sh" ]
