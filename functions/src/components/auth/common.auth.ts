import * as _ from "lodash";
import * as HttpErrors from "http-errors";
import { FirestoreConstant } from "../../engines/firestore/constants.firestore";
import { ConfigConstant } from "../../configs/constants.config";

export class AuthCommon {
    // Db Model
    // private mFsDbParkingAccount = new FirestoreDbParkingAccount();


    static getRoleForVerificationType = (verficationType: string): number => {


        if (verficationType === ConfigConstant.AUTH.verificationType.admin) {
            return FirestoreConstant.User.ROLE.ADMIN
        } else if (verficationType === ConfigConstant.AUTH.verificationType.manager) {
            return FirestoreConstant.User.ROLE.MANAGER
        } else {
            return FirestoreConstant.User.ROLE.GUARD    
        }
    };
}
