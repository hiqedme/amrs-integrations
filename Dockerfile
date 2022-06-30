FROM node:14
ENV TZ="Africa/Nairobi"
RUN date
COPY ./package.json ./
RUN npm i && npm install -g typescript
COPY ./lerna.json ./