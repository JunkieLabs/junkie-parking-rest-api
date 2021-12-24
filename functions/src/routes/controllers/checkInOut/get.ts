import * as Express from "express";
import * as _ from "lodash";
import * as admin from "firebase-admin";
import * as HttpErrors from "http-errors";
import { body, query, validationResult } from "express-validator";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingAccount } from "../../../engines/firestore/interface/parkingAccount";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import { FirestoreDbQrCode } from "../../../engines/firestore/interface/qrCode";
import { FirestoreDbCheckInOut } from "../../../engines/firestore/interface/checkInOut";
import { FirestoreDbVehicle } from "../../../engines/firestore/interface/vehicle";
import { FirestoreDbWheeler } from "../../../engines/firestore/interface/wheeler";

export class ControllerCheckInOutGet {

    // Db Model
    private mFsQrCode = new FirestoreDbQrCode()
    private mFsDbVehicle = new FirestoreDbVehicle()
    private mFsDbCheckInOut = new FirestoreDbCheckInOut()
    private mFsDbParkingAccount = new FirestoreDbParkingAccount();
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbWheeler = new FirestoreDbWheeler();



    constructor(private app: Express.Application, private engine: ApiEngine) { }


    getByQuery = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        try {
            // await body("vehicleNumber").isAscii().run(req);
            // await body("phone").isMobilePhone("en-IN").run(req);
            await query("parkingAreaId").isAscii().run(req);
            await query("status").isNumeric().run(req);


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


            let { parkingAreaId, status, key } = req.query

            let statusInt = (_.isEmpty(status) || isNaN(status as any)) ? 0 : parseInt(status as any);


            console.info("ControllerCheckInOutPost craete 1")
            let dbObjects = await this.mFsDbCheckInOut.getAllByQuery(key ? key as string : null, 10, null,
                parkingAreaId as string, statusInt);
            let dbObjectCheckInOuts = dbObjects.map(dbObject => {
                dbObject.inTimestamp = dbObject.its.toMillis()
                if (dbObject.ots) {
                    dbObject.outTimestamp = dbObject.ots.toMillis()
                }
                return dbObject;

            })
            res.status(200).json({
                key: key,
                result: dbObjectCheckInOuts,
                pageSize: 10
            });
            return;

        } catch (e) {
            console.error(e);

            next(e);
        }
    }

}