# AMRS Integrations
This is a monorepo that stores the services used in implementing integrations with different third party applications

## Getting started

Lerna is being used to manage the various packages. This is a requirement for running the project.

### Install lerna:
 
``` Using yarn 

yarn global add lerna 

or npm 

npm i -g lerna
```
### Installing dependencies
```yarn clean && yarn```

### Setup
 1. copy  the `.env.example`  file to `.env` and add the appropriate  credentials.
 2. ```yarn core``` to build the  core dependencies
 
### Start apps

```yarn adt```
#### SMS Queue
Service to queue appointments
```yarn sms produce <number of  days  to RTC>``` 
#### SMS Notification
 This is  the  service that will be  sending sms
```yarn sms consume```
#### SMS Notification Testing
To test the sms service
```yarn sms <phone number>```