FROM ampathke/amrs-integrations-base
WORKDIR /packages/sms-reminders
COPY  . ./

WORKDIR /packages/sms-reminders
RUN npm install --production
RUN yarn run build

CMD ["node", "/packages/sms-reminders/dist/index.js","consume"]
