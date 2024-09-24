# Usa una imagen base oficial de Node.js
FROM node:20.1-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
COPY *.js .

COPY script.sh .
RUN chmod +x script.sh

EXPOSE 4000
RUN apk update
RUN apk add nano htop neofetch

