# Run script to send welcome messages every 5 minutes
*/5 * * * * /usr/bin/docker exec -t amrs-integrations_sms_1 node /packages/sms-reminders/dist/index.js produce 0 welcome && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/0cc61548-d05f-4e74-9063-ea51907534cc
# Run script to send same day reminder at 6 in the morning
0 6 * * * /usr/bin/docker exec -t amrs-integrations_sms_1 node /packages/sms-reminders/dist/index.js produce 0 sameday && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/0cc61548-d05f-4e74-9063-ea51907534cc
# Run script to send 1 day reminder at consented time 
0 23 * * * /usr/bin/docker exec -t amrs-integrations_sms_1 node /packages/sms-reminders/dist/index.js produce 1 1day && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/0cc61548-d05f-4e74-9063-ea51907534cc
# Run script to send 4 day reminder at consented time
0 23 * * * /usr/bin/docker exec -t amrs-integrations_sms_1 node /packages/sms-reminders/dist/index.js produce 4 4days && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/0cc61548-d05f-4e74-9063-ea51907534cc
# Run script to send missed appointment reminder 1 day after missing
0 23 * * * /usr/bin/docker exec -t amrs-integrations_sms_1 node /packages/sms-reminders/dist/index.js produce 0 missed && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/0cc61548-d05f-4e74-9063-ea51907534cc
# Run script to send appreciation message  every hour
0 * * * * /usr/bin/docker exec -t amrs-integrations_sms_1 node /packages/sms-reminders/dist/index.js produce 0 congratulations && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/0cc61548-d05f-4e74-9063-ea51907534cc