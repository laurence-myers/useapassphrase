FROM node:24-slim

ADD . /code
WORKDIR /code

RUN npm ci
