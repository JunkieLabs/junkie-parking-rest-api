import { ModelGuardCreator } from "./model";
import * as _ from "lodash";
import fetch from "node-fetch"
import EnvConfig from "./../../configs/env.config"
import * as HttpErrors from "http-errors";
import { FirestoreConstant } from "../../engines/firestore/constants.firestore";
import { Guard } from "../../engines/firestore/models/guard";
import { FirestoreDbGuard } from "../../engines/firestore/interface/guard";
import { User } from "../../engines/firestore/models/user";
import { FirestoreDbUser } from "../../engines/firestore/interface/user";
import { RouteConstant } from "../../routes/routes.constant";

export class GuardCreator {
    // Db Model
    // private mFsDbParkingAccount = new FirestoreDbParkingAccount();
    private mFsDbUser = new FirestoreDbUser();
    private mFsDbGuard = new FirestoreDbGuard();


    create = async (
        dbObjectUser: User, creator: ModelGuardCreator): Promise<Guard> => {

        let pModel: Guard = {
            uid: dbObjectUser.id,
            status: 0,
        };

        if (creator.parkingAreaId) {
            pModel = _.merge(pModel, { parkingAreaId: creator.parkingAreaId })
        }

        if (creator.parkingAccountId) {
            pModel = _.merge(pModel, { parkingAccountId: creator.parkingAccountId })
        }

        if (creator.name) {
            pModel = _.merge(pModel, { name: creator.name })
        }

        if (creator.email) {
            pModel = _.merge(pModel, { email: creator.email })
        }


        if (creator.avatarUrl) {
            pModel = _.merge(pModel, { avatarUrl: creator.avatarUrl })
        }





        let dbObjects = await Promise.all([
            this.mFsDbGuard.add(pModel),
            this.mFsDbUser.addRole(dbObjectUser, FirestoreConstant.User.ROLE.GUARD),
        ]);
        let dbObjectGuard = dbObjects[0];

        fetch(
            EnvConfig.apiUrl() + RouteConstant.Base.url.calc + RouteConstant.Calc.url.guardAssign('Ve3wwehVGSXlVbGRqUldoUVYwWg==')
            , {
                method: 'post',
                body: JSON.stringify({
                    guardId: dbObjectGuard.id
                }),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json())

        return dbObjectGuard;
    };
}
