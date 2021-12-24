import * as express from "express";
import { ApiEngine } from "../../../apps/base/apiEngine";
import errorHandler from "../../middleware/errorHandler";

export abstract class RoutesBase {
  router: express.Router;
  constructor(protected app: express.Application, protected engine: ApiEngine) {
    // this.setRoutes()
    // console.info("routes engine: ", engine)
    this.router = express.Router();
    this.app.use("", this.setRoutes());
    // console.log("All routes api");
  }

  abstract setupRoutesList(router: express.Router): void;

  setRoutes() {
    //let userFind = new UserFind(this.app, this.engine);

    this.setupRoutesList(this.router);

    // router.put("/post", post.updateController.update);

    this.router.use(errorHandler);

    return this.router;
  }
}
