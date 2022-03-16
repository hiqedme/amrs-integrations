FROM node:14 as base
COPY ./package.json ./
RUN npm install
COPY ./lerna.json ./
# Package @amrs-integrations/core
FROM base as amrs-integrations_core-build
WORKDIR /app/packages/core
COPY  packages/core/package.json ./
WORKDIR /app/
RUN npx lerna bootstrap --scope=@amrs-integrations/core --includeDependencies
WORKDIR /app/packages/core
# Package @amrs-integrations/sms
FROM base as amrs-integrations_sms-build
WORKDIR /app/packages/sms-reminders
COPY  packages/sms-reminders/package.json ./
WORKDIR /app/
COPY --from=amrs-integrations_core-build /app/packages/core/package.json /app/packages/core/
RUN npx lerna bootstrap --scope=@amrs-integrations/sms --includeDependencies
COPY --from=amrs-integrations_core-build /app/packages/core/ /app/packages/core/
WORKDIR /app/packages/sms-reminders
RUN npm run build
# Package @amrs-integrations/adt-service
FROM base as amrs-integrations_adt-service-0
WORKDIR /app/packages/adt
COPY  packages/adt/dist dist
RUN ls -alh  && pwd
EXPOSE 3000
CMD ["node", "/dist/app.js"]
# final stage
FROM base
COPY --from=amrs-integrations_core-build /app/packages/core /app/packages/core
COPY --from=amrs-integrations_sms-build /app/packages/sms-reminders /app/packages/sms-reminders
COPY --from=amrs-integrations_adt-service-0 /app/packages/adt /app/packages/adt