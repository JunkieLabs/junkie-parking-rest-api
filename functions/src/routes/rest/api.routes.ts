import { ControllerCheckInOut } from './../controllers/checkInOut/index';
import { ControllerQrCode } from './../controllers/qrCode/index';
import { ControllerVehicle } from './../controllers/vehicle/index';
import { ControllerParkingArea } from './../controllers/parkingArea/index';
import { ControllerParkingAccount } from './../controllers/parkingAccount/index';
import * as express from "express";
import { ApiEngine } from "../../apps/base/apiEngine";
import { UserFind } from "../middleware/userFind";
import { RoutesBase } from "./base/routes";
import { ControllerAuth } from '../controllers/auth';
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

    const userFind = new UserFind(this.app, this.engine);

    let auth = new ControllerAuth(this.app, this.engine);
    router.post("/auth/verify", auth.verifyController.verify);


    // //    Guard Route
    const guard = new ControllerGuard(this.app, this.engine)
    router.get("/guard/:id", userFind.findUser, guard.getController.byId);

    const parkingAccount = new ControllerParkingAccount(this.app, this.engine);
    router.post("/parking-account", userFind.findUser, parkingAccount.addController.add);

    const parkingArea = new ControllerParkingArea(this.app, this.engine);
    router.post("/parking-area", userFind.findUser, parkingArea.addController.add);
    router.get("/parking-area/:id", userFind.findUser, parkingArea.getController.byId);
    router.put("/parking-area", userFind.findUser, parkingArea.updateController.update);

    const vehicle = new ControllerVehicle(this.app, this.engine);
    router.post("/vehicle", userFind.findUser, vehicle.addController.add);
    router.put("/vehicle", userFind.findUser, vehicle.updateController.update);


    const qrCode = new ControllerQrCode(this.app, this.engine);
    router.post("/qrcodes/add-bulk", userFind.findUser, qrCode.addBulkController.addBulkQrCodes);
    router.get("/qrcode/vehicle/:code", userFind.findUser, qrCode.getController.getVehicle);


    const checkInOut = new ControllerCheckInOut(this.app, this.engine);
    router.post('/check-in-out', userFind.findUser, checkInOut.checkInOutPostController.create);
    router.get('/check-in-outs', userFind.findUser, checkInOut.checkInOutGetController.getByQuery);

    const report = new ControllerReport(this.app, this.engine);
    router.get('/report/parking-area', userFind.findUser, report.parkingAreaController.getReport);


  }


}
