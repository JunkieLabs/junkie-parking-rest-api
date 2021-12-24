import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingAccount } from "../../../engines/firestore/interface/parkingAccount";
import { ParkingAccount } from "../../../engines/firestore/models/parkingAccount";
import * as HttpErrors from "http-errors";


// // Routes

export class ControllerParkingAccountAdd {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbParkingAccount = new FirestoreDbParkingAccount();

    add = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await body("name").isAscii().run(req);

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
            let { name } = req.body;


            let pModel: ParkingAccount = {
                name: name,
                status: 0,
            };

          

            let dbObjectParkingAccount = await this.mFsDbParkingAccount.getByName(name);
            if (dbObjectParkingAccount){
                next(HttpErrors(401, 'Pakring Account Already Exists'))
                return
            }else{
                dbObjectParkingAccount = await this.mFsDbParkingAccount.add(pModel);
            }

            let result = _.omitBy(dbObjectParkingAccount, _.isNil);
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
