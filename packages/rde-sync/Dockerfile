FROM ampathke/amrs-integrations-base
WORKDIR /packages/rde-sync
COPY  . ./

WORKDIR /packages/rde-sync
RUN touch token.txt
RUN npm i --production
RUN tsc -v
RUN npm run build

CMD ["node", "/packages/rde-sync/dist/app.js"]
