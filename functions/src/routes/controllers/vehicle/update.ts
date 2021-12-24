import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as HttpErrors from "http-errors";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbVehicle } from "../../../engines/firestore/interface/vehicle";

// // Routes

export class ControllerVehicleUpdate {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbVehicle = new FirestoreDbVehicle();


    update = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            // await body("id").isAscii().run(req);

            // let errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     res.status(400).json({ errors: errors.array() });
            //     return;
            // }
            let { name, number, phone } = req.body;

            console.log(name, number);
            

            // let dbObjectVehicle = await this.mFsDbVehicle.getById(id);
            // if (!dbObjectVehicle) {
            //     next(HttpErrors(404, "Vehicle Not found"));
            //     return;
            // }

            let dbObjectVehicle = await this.mFsDbVehicle.getTestingQuery(number, name);
            console.log('🚀', dbObjectVehicle);
            if (!dbObjectVehicle) {
                next(HttpErrors(404, "Vehicle Not found"));
                return;
            }
            

            // let pModel = {
            //     name: name ? name : '',
            //     number: number ? number : '',
            //     phone: phone ? phone : '',
            // };


            // dbObjectVehicle = await this.mFsDbVehicle.updateSelf(dbObjectVehicle, pModel);

            let result = _.omitBy(dbObjectVehicle, _.isNil);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
