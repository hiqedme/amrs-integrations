FROM ampathke/amrs-integrations-base
WORKDIR /packages/eid
COPY  . ./
RUN ls -alh
WORKDIR /packages/eid
RUN touch token.txt
RUN npm i --production
# RUN tsc -v
# RUN npm run build

CMD ["node", "/packages/eid/dist/app.js"]
