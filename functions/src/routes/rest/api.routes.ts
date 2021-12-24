import { ControllerCheckInOut } from './../controllers/checkInOut/index';
import { ControllerQrCode } from './../controllers/qrCode/index';
import { ControllerVehicle } from './../controllers/vehicle/index';
import { ControllerParkingArea } from './../controllers/parkingArea/index';
import { ControllerParkingAccount } from './../controllers/parkingAccount/index';
import * as express from "express";
import { ApiEngine } from "../../apps/base/apiEngine";
import { ControllerTest } from "../controllers/test";
import { UserFind } from "../middleware/userFind";
import { RoutesBase } from "./base/routes";
import { ControllerAuth } from '../controllers/auth';
import { ControllerSubscription } from '../controllers/subscription';
import { ControllerInit } from '../controllers/_init';
import { ControllerGuard } from '../controllers/guard';
import { ControllerReport } from '../controllers/report';


export class RoutesApi extends RoutesBase {



  static init(
    app: express.Application,
    engine: ApiEngine
  ): RoutesApi {
    return new RoutesApi(app, engine);
  }

  setupRoutesList(router: express.Router) {


    let initC = new ControllerInit(this.app, this.engine);
    router.post("/_init", initC.init);


    let auth = new ControllerAuth(this.app, this.engine);
    router.post("/auth/verify", auth.verifyController.verify);


    // //    Guard Route
    const guard = new ControllerGuard(this.app, this.engine)
    router.get("/guard/:id", guard.getController.byId);

    const parkingAccount = new ControllerParkingAccount(this.app, this.engine);
    router.post("/parking-account", parkingAccount.addController.add);

    const parkingArea = new ControllerParkingArea(this.app, this.engine);
    router.post("/parking-area", parkingArea.addController.add);
    router.get("/parking-area/:id", parkingArea.getController.byId);
    router.put("/parking-area", parkingArea.updateController.update);

    const vehicle = new ControllerVehicle(this.app, this.engine);
    router.post("/vehicle", vehicle.addController.add);
    router.put("/vehicle", vehicle.updateController.update);


    const qrCode = new ControllerQrCode(this.app, this.engine);
    router.post("/qrcodes/add-bulk", qrCode.addBulkController.addBulkQrCodes);
    router.get("/qrcode/vehicle/:code", qrCode.getController.getVehicle);


    const subscription = new ControllerSubscription(this.app, this.engine);
    router.post("/subscription", subscription.addController.add);

    const checkInOut = new ControllerCheckInOut(this.app, this.engine);
    router.post('/check-in-out', checkInOut.checkInOutPostController.create);
    router.get('/check-in-outs', checkInOut.checkInOutGetController.getByQuery);

    const report = new ControllerReport(this.app, this.engine);
    router.get('/report/parking-area', report.parkingAreaController.getReport);


  }


}
