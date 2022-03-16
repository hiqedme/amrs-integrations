FROM base

COPY ./dist dist

RUN ls -alh  && pwd
EXPOSE 3000
CMD ["node", "/dist/app.js"]