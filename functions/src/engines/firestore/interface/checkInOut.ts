import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { CheckInOut } from "../models/checkInOut";
import { ConfigConstant } from "../../../configs/constants.config";
import { FirestoreConstant } from "../constants.firestore";
import { FirestoreUtil } from "../firestore.util";

export class FirestoreDbCheckInOut {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.checkInOut);
    add = async (pModel: CheckInOut): Promise<CheckInOut> => {
        try {
            let fieldValue = admin.firestore.FieldValue;
            const dbDoc = admin.firestore().collection(this.mRefPoint).doc();
            let model = pModel;
            model = _.merge(model, {
                id: dbDoc.id,
                cts: fieldValue.serverTimestamp(),
                uts: fieldValue.serverTimestamp(),
                its: fieldValue.serverTimestamp(),
            });
            await dbDoc.set(model);
            let dbObject = await dbDoc.get();
            return dbObject.data() as CheckInOut;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: CheckInOut, pModel: any): Promise<CheckInOut> => {
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
            return dbObject.data() as CheckInOut;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<CheckInOut> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as CheckInOut | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };


    getActive = async (pVehicleNumber?: string, pQrCode?: String, associateArea?: boolean): Promise<CheckInOut> => {
        try {
            let dbObject: CheckInOut[] = [];
            let dbObjectRef = admin
                .firestore()
                .collection(this.mRefPoint) as admin.firestore.Query;
            if (pVehicleNumber) {
                console.info("getActive: ", pVehicleNumber)
                dbObjectRef = dbObjectRef.where(FirestoreConstant.CheckInOut.property.vehicleNumber, "==", pVehicleNumber);
            }

            if (pQrCode) {
                dbObjectRef = dbObjectRef.where(FirestoreConstant.CheckInOut.property.qrCode, "==", pQrCode);
            }

            dbObjectRef = dbObjectRef.where(FirestoreConstant.CheckInOut.property.status, "==", ConfigConstant.CHECKINOUT.STATUS.active)

            let res = await dbObjectRef.get()

            console.info("getActive: ", res.docs.length)
            dbObject = res.docs.map<CheckInOut>(doc => ({ id: doc.id, ...doc.data() }) as CheckInOut);

            if (dbObject) {
                return dbObject[0];
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    checkout = async (pDbObject: CheckInOut, pModel: any): Promise<CheckInOut> => {
        try {


            let fieldValue = admin.firestore.FieldValue
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pDbObject.id);
            const dbDoc = admin.firestore().doc(dbDocRef);
            let model = pModel
            model = _.merge(model, {
                id: dbDoc.id,
                uts: fieldValue.serverTimestamp(),
                ots: fieldValue.serverTimestamp(),
            })
            let dbObject = await dbDoc.get();
            if (dbObject.exists) {
                await dbDoc.set(pModel, { merge: true });
                dbObject = await dbDoc.get();
            }
            return dbObject.data() as CheckInOut;
        } catch (err) {
            throw err;
        }
    };

    getAllByQuery = async (documentId?: string, limit?: number, accountId?: String, parkingAreaId?: String, status?: number, dateStart?: admin.firestore.Timestamp, dateEnd?: admin.firestore.Timestamp, wheeler?: number, lastString?: string): Promise<CheckInOut[]> => {

        try {
            var queryFn: any = admin
                .firestore()
                .collection(this.mRefPoint)
                .withConverter(FirestoreUtil.converter<CheckInOut>())

            let query = {}
            // if (search) {
            //     let searchRegex = new RegExp('^' + search + '.*$', "i")
            //     query = _.merge(query, { name: { $regex: searchRegex } })
            // }
            // if (lastString) {
            //     let lastRegex = new RegExp('^.*' + lastString + '$', "i")
            //     query = _.merge(query, { vehicleNumber: { $regex: lastRegex } })

            // }

            if (accountId) {

                queryFn = queryFn.where(FirestoreConstant.CheckInOut.property.parkingAccountId, "==", accountId)


            }
            if (parkingAreaId) {
                queryFn = queryFn.where(FirestoreConstant.CheckInOut.property.parkingAreaId, "==", parkingAreaId)

            }

            if (status == FirestoreConstant.CheckInOut.status.COMPLETED) {
                // to check for  checkout entries
                queryFn = queryFn.where(FirestoreConstant.CheckInOut.property.status, "==", status)

            } else if (status == FirestoreConstant.CheckInOut.status.ACTIVE) {
                queryFn = queryFn.where(FirestoreConstant.CheckInOut.property.status, "==", status)

            }

            if (dateStart && dateEnd) {

                queryFn = queryFn.where(FirestoreConstant.CheckInOut.property.ots, ">", dateStart)
                queryFn = queryFn.where(FirestoreConstant.CheckInOut.property.ots, "<=", dateEnd)

            }

            // if (wheeler) {
            //     query = _.merge(query, { wheeler: wheeler })
            // }

            // console.log("interface getallbyquery", query);
            if (limit) {
                queryFn = queryFn.limit(limit)

            }
            if (documentId) {

                queryFn = queryFn.startAfter(documentId);

            }

            const response = await queryFn.get()

            if (response.docs != null && response.docs.length > 0) {
                return response.docs.map(doc => doc.data());
            }

            return [];


        } catch (err) {

            throw err;
        }
    };
}
