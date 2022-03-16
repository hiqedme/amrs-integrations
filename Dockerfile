FROM node:14
COPY ./package.json ./
RUN npm i && npm install -g typescript
COPY ./lerna.json ./