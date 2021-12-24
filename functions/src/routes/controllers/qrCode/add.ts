import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbQrCode } from "../../../engines/firestore/interface/qrCode";


// // Routes

export class ControllerQrCodeAdd {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbQrCode = new FirestoreDbQrCode();

    addBulkQrCodes = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
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
            let { } = req.body;

            let dbObjectQrCode = await this.mFsDbQrCode.addByBulk();
            
            let result = _.omitBy(dbObjectQrCode, _.isNil);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
