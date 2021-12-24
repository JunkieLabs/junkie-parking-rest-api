
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

import * as express from 'express'
import * as functions from 'firebase-functions'
import { Api } from './apps/api'
import EnvSetup from './envSetup';
import * as moment from "moment";
import { MyApp } from './apps/base/app';

// Environment Setup
console.info("App init", moment().valueOf());

EnvSetup.init();

const myApp = MyApp.bootstrap()

const app: express.Application = Api.bootstrap(myApp).app

// if(EnvConfig.isProduction()){
export const parkingApi = functions.https.onRequest(app)