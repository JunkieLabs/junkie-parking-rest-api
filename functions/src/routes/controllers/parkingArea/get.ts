import * as Express from "express";
import { body, param, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import * as HttpErrors from "http-errors";


// // Routes

export class ControllerParkingAreaGet {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbParkingArea = new FirestoreDbParkingArea();

    byId = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await param("id").isAscii().run(req);

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
            let { id } = req.params;



            var dbObjectParkingArea = await this.mFsDbParkingArea.getById(id);



            if (!dbObjectParkingArea) {
                next(HttpErrors(404, "Parking arae not found"));
                return;
            }


            let result = _.omitBy(dbObjectParkingArea, _.isNil);
            res.status(200).json(result);
            return;

        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
