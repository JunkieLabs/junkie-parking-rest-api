import { ApiEngine } from "../../apps/base/apiEngine";
import { ConfigConstant } from "../../configs/constants.config";
import { FirestoreConstant } from "../../engines/firestore/constants.firestore";
import { FirestoreDbParkingAccount } from "../../engines/firestore/interface/parkingAccount";
import { FirestoreDbWheeler } from "../../engines/firestore/interface/wheeler";

export class InitHandler {



    private mFsDbWheeler = new FirestoreDbWheeler();
    private mFsDbParkingAccount = new FirestoreDbParkingAccount();

    constructor(private apiEngine: ApiEngine) {
        // this.mDbRef = this.expressComponents.firebaseDb.ref(FirebaseDbRef.getRef())
    }

    initialize = async () => {

        var dbObjectWheelers = await this.mFsDbWheeler.getAll()

        if (!dbObjectWheelers || dbObjectWheelers.length <= 0) {

            await this.mFsDbWheeler.add({
                label: "Bike",
                type: FirestoreConstant.WHEELER.TYPE.bike,
                tyreCount: 2,
            })

            await this.mFsDbWheeler.add({
                label: "Car",
                type: FirestoreConstant.WHEELER.TYPE.car,
                tyreCount: 4,
            })
        }

        var dbObjectParkingAccounts = await this.mFsDbParkingAccount.getAll()

        if (!dbObjectParkingAccounts || dbObjectParkingAccounts.length <= 0) {
            await this.mFsDbParkingAccount.add({
                name: ConfigConstant.PARKING_ACCOUNT_DEFAULT,
                status: 0
            })

        }


    }

}