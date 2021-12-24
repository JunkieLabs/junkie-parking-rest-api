import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { QrCode } from "../models/qrCode";
import nanoidGenerate = require("nanoid/generate");
import { FirestoreConstant } from "../constants.firestore";

export class FirestoreDbQrCode {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.qrCode);
    add = async (pModel?: QrCode): Promise<QrCode> => {
        try {
            let fieldValue = admin.firestore.FieldValue;
            const dbDoc = admin.firestore().collection(this.mRefPoint).doc();
            let model = pModel;
            model = _.merge(model, {
                id: dbDoc.id,
                code: nanoidGenerate("0123456789", 16),
                cts: fieldValue.serverTimestamp(),
                uts: fieldValue.serverTimestamp(),
            });
            await dbDoc.set(model);
            let dbObject = await dbDoc.get();
            return dbObject.data() as QrCode;
        } catch (error) {
            throw new Error(error);
        }
    };


    addByBulk = async (pModel?: QrCode): Promise<FirebaseFirestore.WriteResult[]> => {
        try {
            let fieldValue = admin.firestore.FieldValue;
            let batch = admin.firestore().batch();
            for (let index = 0; index < 20; index++) {
                const dbDoc = admin.firestore().collection(this.mRefPoint).doc();
                let model = pModel;
                model = _.merge(model, {
                    id: dbDoc.id,
                    code: nanoidGenerate("0123456789", 16),
                    cts: fieldValue.serverTimestamp(),
                    uts: fieldValue.serverTimestamp(),
                });
                batch.set(dbDoc, model);
            }
            return await batch.commit();
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: QrCode, pModel?: any): Promise<QrCode> => {
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
            return dbObject.data() as QrCode;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<QrCode> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as QrCode | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    getByCode = async (code: string): Promise<QrCode> => {
        try {
            let dbObject: QrCode[] = [];
            const dbObjectThreads = await admin
                .firestore()
                .collection(this.mRefPoint)
                .where(FirestoreConstant.QrCode.property.code, "==", code)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        dbObject.push(doc.data() as QrCode);
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
}
