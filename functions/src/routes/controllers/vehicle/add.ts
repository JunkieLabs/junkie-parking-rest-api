import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { VehicleCreator } from "../../../components/vehicle/creator";
import { FirestoreDbQrCode } from "../../../engines/firestore/interface/qrCode";
import { FirestoreDbVehicle } from "../../../engines/firestore/interface/vehicle";
import { QrCode } from "../../../engines/firestore/models/qrCode";
import * as HttpErrors from "http-errors";
import { Vehicle } from "../../../engines/firestore/models/vehicle";

// // Routes

export class ControllerVehicleAdd {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mVehicleCreator = new VehicleCreator();
    private mFsDbVehicle = new FirestoreDbVehicle();
    private mFsDbQrCode = new FirestoreDbQrCode();

    add = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await body("number").isAscii().run(req);
            await body("wheeler").isNumeric().run(req);
            await body("phone").isAscii().run(req);
                     
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.info("error: ", errors)
                let error = _.first(errors.array());
                const errValidation = {
                    code: 400,
                    message: error['msg'] +" "+ error['param'],
                    errors: errors.array(),
                };
                next(errValidation);

                return
            }
            let pModelReq = req.body;

            let dbObjectQrCode: QrCode

            if (pModelReq.qrCode) {
                dbObjectQrCode = await this.mFsDbQrCode.getByCode(pModelReq.qrCode)
                if (dbObjectQrCode.entity) {
                   next(HttpErrors(401, 'Invalid QrCode'));
                   return;
                }
            }

            if (!dbObjectQrCode) {
                dbObjectQrCode = await this.mFsDbQrCode.add();
            }

            let pModelVehicle = _.pick(pModelReq, ["email", "phone", "number", "wheeler", "name"])
            pModelVehicle = _.merge(pModelVehicle, { qrId: dbObjectQrCode.id })
            pModelVehicle = _.merge(pModelVehicle, { qrC: dbObjectQrCode.code })
        
            let dbObjectVehicle = await this.mVehicleCreator.create(pModelVehicle);
            // let dbObjectVehicle = await this.mFsDbVehicle.add(pModelVehicle as Vehicle);
            let result = _.omitBy(dbObjectVehicle, _.isNil);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
