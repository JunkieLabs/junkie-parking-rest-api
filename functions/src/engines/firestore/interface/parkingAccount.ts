import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { ParkingAccount } from "../models/parkingAccount";
import { FirestoreConstant } from "../constants.firestore";

export class FirestoreDbParkingAccount {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.parkingAccount);
    add = async (pModel: ParkingAccount): Promise<ParkingAccount> => {
        try {
            let fieldValue = admin.firestore.FieldValue;
            const dbDoc = admin.firestore().collection(this.mRefPoint).doc();
            let model = pModel;
            model = _.merge(model, {
                id: dbDoc.id,
                cts: fieldValue.serverTimestamp(),
                uts: fieldValue.serverTimestamp(),
            });
            await dbDoc.set(model);
            let dbObject = await dbDoc.get();
            return dbObject.data() as ParkingAccount;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: ParkingAccount, pModel: any): Promise<ParkingAccount> => {
        try {


            let fieldValue = admin.firestore.FieldValue
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pDbObject.id);
            const dbDoc = admin.firestore().doc(dbDocRef);
            let model = pModel
            model = _.merge(model, {
                id: dbDoc.id,
                uts: fieldValue.serverTimestamp(),
            })
            // console.info("updateSelf: ", model);
            let dbObject = await dbDoc.get();
            if (dbObject.exists) {
                await dbDoc.set(pModel, { merge: true });
                dbObject = await dbDoc.get();
            }
            return dbObject.data() as ParkingAccount;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<ParkingAccount> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as ParkingAccount | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };


    getByName = async (pName: string): Promise<ParkingAccount> => {
        try {
            let dbObject: ParkingAccount[] = [];
            await admin
                .firestore()
                .collection(this.mRefPoint)
                .where(FirestoreConstant.ParkingAccount.property.name, "==", pName)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        dbObject.push(doc.data() as ParkingAccount);
                    });
                });
            if (dbObject) {
                return dbObject[0];
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    getAll = async (): Promise<ParkingAccount[]> => {
        try {
            
            let dbObjects = [];
            let dbobjectFn = admin.firestore().collection(this.mRefPoint);

            const dbCollection = await dbobjectFn.get()
                .then((querySnapshot) => {
                    // console.info("getByProviderUserId 3: ", querySnapshot.size);l̥
                    querySnapshot.forEach((doc) => {
                        dbObjects.push(doc.data())
                    });
                });
            return dbObjects
        } catch (error) {
            throw new Error(error);
        }
    };
}
