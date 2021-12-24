import { ModelUserCreator } from "./model";
import * as _ from "lodash";
import * as HttpErrors from "http-errors";
import { FirestoreConstant } from "../../engines/firestore/constants.firestore";
import { User } from "../../engines/firestore/models/user";
import { FirestoreDbUser } from "../../engines/firestore/interface/user";

export class UserCreator {
    // Db Model
    // private mFsDbParkingAccount = new FirestoreDbParkingAccount();
    private mFsDbUser = new FirestoreDbUser();


    create = async (creator: ModelUserCreator): Promise<User> => {

        let pModel: User = {
            roles: [],
            status: 0,
        };

        let dbObjectUser = await this.mFsDbUser.add(pModel);

        return dbObjectUser;
    };
}
