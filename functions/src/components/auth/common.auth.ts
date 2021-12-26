import * as _ from "lodash";
import * as HttpErrors from "http-errors";
import { FirestoreConstant } from "../../engines/firestore/constants.firestore";
import { ConfigConstant } from "../../configs/constants.config";

export class AuthCommon {
    // Db Model
    // private mFsDbParkingAccount = new FirestoreDbParkingAccount();


    static getRoleForVerificationType = (verficationType: string): number => {

        return FirestoreConstant.User.ROLE.GUARD

    };
}
