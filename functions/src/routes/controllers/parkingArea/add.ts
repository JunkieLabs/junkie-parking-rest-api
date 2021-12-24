import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as HttpErrors from "http-errors";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingAccount } from "../../../engines/firestore/interface/parkingAccount";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import { FirestoreDbWheeler } from "../../../engines/firestore/interface/wheeler";
import { ParkingArea, WheelerRate } from "../../../engines/firestore/models/parkingArea";


// // Routes

export class ControllerParkingAreaAdd {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    // private mParkingAreaCreator = new ParkingAreaCreator();
    // Db Model
    private mFsDbParkingAccount = new FirestoreDbParkingAccount();
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbWheeler = new FirestoreDbWheeler();


    add = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await body("name").isAscii().run(req);
            await body("parkingAccountId").isAscii().run(req);
            await body("rates").isArray().run(req);


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
            let { name, parkingAccountId, rates } = req.body;

            let dbParkingAccount = await this.mFsDbParkingAccount.getById(parkingAccountId);

            if (!dbParkingAccount) {
                throw HttpErrors(401, 'Invalid Parking Account Id');
            }


            var isValid = true

            var wheelerRates: WheelerRate[] = [];
            for (let i = 0; i < rates.length; i++) {
                const rate = rates[i];
                if (!rate['type'] || !rate['rate']) {
                    isValid = false
                }


                var dbObjectWheeler = await this.mFsDbWheeler.getByType(rate['type'])
                if (!dbObjectWheeler) {
                    isValid = false
                } else {

                    wheelerRates.push({
                        type: dbObjectWheeler.type,
                        rate: rate['rate'],
                        tyreCount: dbObjectWheeler.tyreCount,
                        label: dbObjectWheeler.label

                    })
                }

            }

            if (!isValid) {
                next(HttpErrors(401, 'Invalid Rates'));
                return
            }

            let pModel: ParkingArea = {
                name: name,
                parkingAccountId: dbParkingAccount.id,
                guards: [],
                guardsCount : 0,
                rates: wheelerRates,
                status: 0,
            };


            let dbObjectParkingArea = await this.mFsDbParkingArea.add(pModel);

            // let dbObjectParkingArea = await this.mParkingAreaCreator.create(reqBody);
            let result = _.omitBy(dbObjectParkingArea, _.isNil);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
