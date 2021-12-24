import * as Express from "express";
import { body, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { GuardCreator } from "../../../components/guard/creator";
import { FirestoreDbGuard } from "../../../engines/firestore/interface/guard";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import * as HttpErrors from "http-errors";
import { ArrayUtil } from "../../../utils/array-util";


// // Routes

export class ControllerGuardUpdate {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbGuard = new FirestoreDbGuard();

    parkingArea = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await body("parkingAccountId").isAscii().run(req);
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
            let { parkingAccountId, id } = req.body;

            let dbObjects = await Promise.all([
                this.mFsDbParkingArea.getById(parkingAccountId),
                this.mFsDbGuard.getById(id),
            ]);

            let dbObjectParkingArea = dbObjects[0];
            if (!dbObjectParkingArea) {
                next(HttpErrors(404, "Parking Area Not found"));
                return;
            }

            let dbObjectGuard = dbObjects[1];
            if (!dbObjectGuard) {
                next(HttpErrors(404, "Guard Not found"));
                return;
            }

            if (dbObjectGuard.parkingAccountId === dbObjectParkingArea.parkingAccountId) {
                next(HttpErrors(400, "Parking Accounts do not match"));
                return;
            }

            if (dbObjectGuard.parkingAreaId == dbObjectParkingArea.id) {
                res.status(200).json(dbObjectGuard);
                return;
            }

            dbObjectGuard.parkingAreaId = dbObjectParkingArea.id;

            dbObjectGuard = await this.mFsDbGuard.updateSelf(dbObjectGuard, { parkingAreaId: id })

            // let index = ArrayUtil.objectIdindex(
            //     dbObjectParkingArea.guards as IGuard["_id"][],
            //     dbObjectGuard._id
            // );

            // if (index >= 0) {
            // } else {
            //     dbObjectParkingArea.guards.push(dbObjectGuard._id);
            // }

            // let dbObjectsUpdate = await Promise.all([
            //     this.dbGuard.update(dbObjectGuard),
            //     this.dbParkingArea.update(dbObjectParkingArea),
            // ]);
            let result = _.omitBy(dbObjectGuard, _.isNil);
            res.status(200).json(result);
            return;
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
