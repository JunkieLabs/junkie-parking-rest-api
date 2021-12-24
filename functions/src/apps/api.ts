import { ApiCommon } from "./common/common.api";
import { RoutesApi } from "../routes/rest/api.routes";
import { MyApp } from "./base/app";
export class Api extends ApiCommon {
  static bootstrap(myApp: MyApp): Api {
    return new Api(myApp);
  }

  setUpRoutes() {
    // console.info("setiing route");
    RoutesApi.init(this.app, this.engine);
  }
}
