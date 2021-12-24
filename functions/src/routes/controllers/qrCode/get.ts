import * as Express from "express";
import * as _ from "lodash";
import * as admin from "firebase-admin";
import * as HttpErrors from "http-errors";
import { body, param, query, validationResult } from "express-validator";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingAccount } from "../../../engines/firestore/interface/parkingAccount";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import { FirestoreDbQrCode } from "../../../engines/firestore/interface/qrCode";
import { FirestoreDbCheckInOut } from "../../../engines/firestore/interface/checkInOut";
import { FirestoreDbVehicle } from "../../../engines/firestore/interface/vehicle";
import { FirestoreConstant } from "../../../engines/firestore/constants.firestore";
import { CheckInOut } from "../../../engines/firestore/models/checkInOut";
import { Vehicle } from "../../../engines/firestore/models/vehicle";
import { FirestoreDbWheeler } from "../../../engines/firestore/interface/wheeler";
import { PriceCalculator } from "../../../utils/priceCalculator";

export class ControllerQrCodeGet {

    // Db Model
    private mFsDbQrCode = new FirestoreDbQrCode()
    private mFsDbVehicle = new FirestoreDbVehicle()



    constructor(private app: Express.Application, private engine: ApiEngine) { }


    getVehicle = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        try {
            // await body("vehicleNumber").isAscii().run(req);
            // await body("phone").isMobilePhone("en-IN").run(req);
            await param("code").isAscii().run(req);


            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.info("error: ", errors)
                let error = _.first(errors.array());
                const errValidation = {
                    code: 400,
                    message: error['msg'] + " " + error['param'],
                    errors: errors.array(),
                };
                next(errValidation);

                return
            }


            let { code } = req.params



            console.info("ControllerCheckInOutPost craete 1")
            let dbObjectQrCode = await this.mFsDbQrCode.getByCode(code);

            if (!dbObjectQrCode) {
                next(HttpErrors(404, 'Code not found'))
                return
            }

            if (dbObjectQrCode.entityType != FirestoreConstant.QrCode.entityType.vehicle) {
                next(HttpErrors(400, 'Not a valid code'))
                return
            }

            var dbObjectVehicle = await this.mFsDbVehicle.getById(dbObjectQrCode.entity);


            if (!dbObjectVehicle) {
                next(HttpErrors(404, 'Vehicle not found'))
                return
            }



            let result = _.omitBy(dbObjectVehicle, _.isNil);


            // let dbObjectCheckInOuts = dbObjects.map(dbObject => {
            //     dbObject.inTimestamp = dbObject.its.toMillis()
            //     if (dbObject.ots) {
            //         dbObject.outTimestamp = dbObject.ots.toMillis()
            //     }
            //     return dbObject;

            // })
            res.status(200).json(
                result
            );
            return;

        } catch (e) {
            console.error(e);

            next(e);
        }
    }

}