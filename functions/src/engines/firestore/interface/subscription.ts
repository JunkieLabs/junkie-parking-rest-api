import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { Subscription } from "../models/subscription";
import { FirestoreConstant } from "../constants.firestore";

export class FirestoreDbSubscription {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.subscription);
    add = async (pModel: Subscription): Promise<Subscription> => {
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
            return dbObject.data() as Subscription;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: Subscription, pModel: any): Promise<Subscription> => {
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
            return dbObject.data() as Subscription;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<Subscription> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as Subscription | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };


    getByVehicle = async (number?: string, qrCode?: string): Promise<Subscription> => {
        try {
            let dbObject: Subscription[] = [];
            let dbObjectRef = await admin
                .firestore()
                .collection(this.mRefPoint) as admin.firestore.Query;
            if (number) {
                dbObjectRef = dbObjectRef.where(FirestoreConstant.Subscription.property.vehicleNumber, "==", number);
            }

            if (qrCode) {
                dbObjectRef = dbObjectRef.where(FirestoreConstant.Subscription.property.qrCode, "==", qrCode);
            }

            let res = await dbObjectRef.get()
            dbObject = res.docs.map<Subscription>(doc => doc.data() as Subscription);
            if (dbObject) {
                return dbObject[0];
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };
}
