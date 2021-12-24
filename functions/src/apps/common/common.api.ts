import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as HttpErrors from "http-errors";
import * as path from "path";
import * as morgan from "morgan";
import * as cors from "cors";
import * as compression from "compression";
import { MyApp, MyAppCallback } from "../base/app";
import { ApiEngine } from "../base/apiEngine";


export abstract class ApiCommon implements MyAppCallback {
  app: express.Application = express();
  engine: ApiEngine;

  constructor(protected myApp: MyApp) {
    this.engine = myApp.engine;
    this.config();
  }

  config() {
    this.init();
    this.myApp.addCallback(this);
  }

  init() {
    const app = this.app;

    this.app.use(
      "/",
      express.static(path.join(__dirname, "./../../../public"))
    );
    this.app.use(morgan("dev"));
    console.info("--- Common Api Initiated ---");
    // console.info("init base2", moment().valueOf());
    this.app.use(cookieParser());
    this.app.use(cors());

    // Helmit
    // this.app.use(helmet());
    // this.app.use(helmet.noCache());
    // this.app.use(helmet.frameguard('SAMEORIGIN'));
    // this.app.use(helmet.xssFilter({ setOnOldIE: true }));
    // this.app.use(helmet.hsts({
    //     maxAge: 7776000000,
    //     includeSubDomains: true
    // }));
    // this.app.use(helmet.hidePoweredBy());
    // this.app.use(helmet.noSniff());

    // Compression
    this.app.use(compression());
    // Set Content Types
    this.app.use(
      (req: express.Request, res: any, next: express.NextFunction) => {
        let contentTypes: string[] = [
          "application/x-www-form-urlencoded",
          "application/json",
          "application/json; charset=UTF-8",
          'application/json; charset=utf-8',
          "application/octet-stream",
        ];


        // console.info(`cnetent Type:  |${req.headers["content-type"]}|`,  contentTypes[3]==req.headers["content-type"].toString(), contentTypes, req.headers);
        if (
          req.headers["content-type"]
        ) {
          let found = false
          for (let i = 0; i < contentTypes.length; i++) {
            const element = contentTypes[i];
            if (element == req.headers["content-type"]) {
              found = true
            }
            // console.info(`cnetent Type 2:  `, found);

          }

          if (!found) {
            // console.info(`cnetent Type 3:  `, found);
            throw HttpErrors(400, "Content Type not acceptable");

          }
          // return res.boom.notAcceptable("Content Type not acceptable");
        }

        next();
      }
    );
  }

  abstract setUpRoutes(): void;

  onAppReady(pEngine: ApiEngine) {
    this.engine = pEngine;
    this.setUpRoutes();
  }
}
