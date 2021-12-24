import * as Express from "express";
import { body, param, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { GuardCreator } from "../../../components/guard/creator";
import { FirestoreDbGuard } from "../../../engines/firestore/interface/guard";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import * as HttpErrors from "http-errors";
import { ArrayUtil } from "../../../utils/array-util";


// // Routes

export class ControllerGuardGet {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbGuard = new FirestoreDbGuard();

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



            var dbObjectGuard = await this.mFsDbGuard.getById(id);



            if (!dbObjectGuard) {
                next(HttpErrors(404, "Guard Not found"));
                return;
            }


            let result = _.omitBy(dbObjectGuard, _.isNil);
            res.status(200).json(result);
            return;

        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
