import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { Report } from "../models/report";

export class FirestoreDbReport {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.qrCode);
    add = async (pModel: Report): Promise<Report> => {
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
            return dbObject.data() as Report;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: Report, pModel: any): Promise<Report> => {
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
            return dbObject.data() as Report;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<Report> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as Report | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };
}
