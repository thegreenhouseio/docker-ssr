FROM ubuntu:16.04

RUN apt-get update \ 
    && apt-get install -y curl vim git bzip2 ssh \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@^1.0.0

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY server.js ./
COPY .babelrc ./
COPY ./src/** ./src/
COPY ./src/reducers/** ./src/reducers/
COPY ./src/containers/** ./src/containers/
COPY ./src/components/** ./src/components/
COPY ./static/** ./static/

RUN yarn install

EXPOSE 3001

CMD [ "npm", "start" ]