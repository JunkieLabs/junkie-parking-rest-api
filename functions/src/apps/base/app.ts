import * as admin from "firebase-admin";
import { ApiEngine } from "./apiEngine";
import EnvConfig from "../../configs/env.config";
import { InitHandler } from "../../components/_init/init.handler";

export class MyApp {
  static bootstrap(): MyApp {
    return new MyApp();
  }

  engine: ApiEngine = new ApiEngine();
  callbacks: MyAppCallback[] = [];

  private mInitHandler: InitHandler = new InitHandler(this.engine);
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
    admin.initializeApp();
    admin.firestore().settings({ ignoreUndefinedProperties: true });
    console.log("--- Firestore Db Initated ---");
    this.mInitHandler = new InitHandler(this.engine);
    this.mInitHandler.initialize();


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
