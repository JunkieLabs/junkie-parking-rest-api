import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { Guard } from "../models/guard";
import { FirestoreConstant } from "../constants.firestore";

export class FirestoreDbGuard {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.guard);
    add = async (pModel: Guard): Promise<Guard> => {
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
            return dbObject.data() as Guard;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: Guard, pModel: any): Promise<Guard> => {
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
            return dbObject.data() as Guard;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<Guard> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as Guard | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    getByUID = async (uid: string): Promise<Guard> => {
        try {
            let dbObject: Guard;
            const querySnapshot = await admin.firestore()
                .collection(this.mRefPoint)
                .where(FirestoreConstant.Guard.property.userId, "==", uid)
                .get()

            if (querySnapshot && querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                    dbObject = doc.data() as Guard;
                });
                return dbObject
            } else {
                return null
            }
        } catch (error) {
            throw error;
        }
    };

   

}
