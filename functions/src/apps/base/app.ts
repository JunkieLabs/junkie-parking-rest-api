import * as admin from "firebase-admin";
import { ApiEngine } from "./apiEngine";
import EnvConfig from "../../configs/env.config";

export class MyApp {
  static bootstrap(): MyApp {
    return new MyApp();
  }

  engine: ApiEngine = new ApiEngine();
  callbacks: MyAppCallback[] = [];

  isAppReady = false;

  constructor() {
    this.config();
  }

  config() {
    this.attachEngine();
    this.isAppReady = true;
    this.notifyCallbacks();
  }

  attachEngine() {
    // console.info("engine base 1", moment().valueOf());
    // let firebaseAdminFile = EnvConfig.firebaseAdmin();
    // let serviceAccount = require("./../../../" + firebaseAdminFile);
    // let firebaseDbUrl = EnvConfig.firebaseDb();
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   databaseURL: firebaseDbUrl,
    //   storageBucket: EnvConfig.firebaseStorageBucket(),
    // });
    admin.initializeApp();
    admin.firestore().settings({ ignoreUndefinedProperties: true });
    console.log("--- Firestore Db Initated ---");


  }
  addCallback(callback: MyAppCallback) {
    if (this.isAppReady) {
      // console.info(" addCallback here: ", this.callbacks);
      callback.onAppReady(this.engine);
    } else {
      this.callbacks.push(callback);
    }
  }

  notifyCallbacks() {
    // console.info("notifyCallbacks: ", this.callbacks.length);
    this.callbacks.forEach((callback) => callback.onAppReady(this.engine));
  }
}

export interface MyAppCallback {
  onAppReady(pEngine?: ApiEngine): void;
}
