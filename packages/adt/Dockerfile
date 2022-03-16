FROM ampathke/amrs-integrations-base
WORKDIR /packages/adt
COPY  . ./


WORKDIR /packages/adt
RUN ls -alh && pwd
RUN npm install --production
RUN ls -alh && pwd
RUN yarn run build
EXPOSE 3000
CMD ["node", "/packages/adt/dist/app.js"]