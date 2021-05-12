FROM alpine:latest
RUN apk update && apk upgrade
RUN apk add nodejs npm && node -v
RUN rm -rf /var/cache/apk/*

COPY . .

RUN npm install typescript -g && tsc
RUN ls -alh  && pwd
EXPOSE 3000
CMD ["node", "/dist/app.js"]