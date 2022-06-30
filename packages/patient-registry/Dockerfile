FROM ampathke/amrs-integrations-base
WORKDIR /packages/patient-registry
COPY  . ./

WORKDIR /packages/patient-registry
RUN touch token.txt
RUN npm install --production
RUN tsc -v
RUN yarn run build

CMD ["node", "/packages/patient-registry/dist/app.js"]
