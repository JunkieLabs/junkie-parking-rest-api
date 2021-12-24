import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as HttpErrors from "http-errors";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import { FirestoreDbWheeler } from "../../../engines/firestore/interface/wheeler";
import { WheelerRate } from "../../../engines/firestore/models/parkingArea";

// // Routes

export class ControllerParkingAreaUpdate {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbWheeler = new FirestoreDbWheeler();


    update = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await body("id").isAscii().run(req);

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
            let { id, name, parkingAccountId,rates  } = req.body;

            let dbObjectParkingArea = await this.mFsDbParkingArea.getById(id);
            if (!dbObjectParkingArea) {
                next(HttpErrors(404, "ParkingArea Not found"));
                return;
            }

            let pModel = {
            };

            if (name) {
                pModel = _.merge(pModel, { n: name });
            }

            if (parkingAccountId) {
                pModel = _.merge(pModel, { parkingAccountId: parkingAccountId });
            }

            if (rates) {

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
                pModel = _.merge(pModel, { rates: wheelerRates });
            }

           

            dbObjectParkingArea = await this.mFsDbParkingArea.updateSelf(dbObjectParkingArea, pModel);

            let result = _.omitBy(dbObjectParkingArea, _.isNil);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
