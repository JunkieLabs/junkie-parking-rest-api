import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { AuthProvider } from "../models/authProvider";
import { FirestoreConstant } from "../constants.firestore";

export class FirestoreDbAuthProvider {
    mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.authProvider);
    add = async (pModel: AuthProvider): Promise<AuthProvider> => {
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
            return dbObject.data() as AuthProvider;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateSelf = async (pDbObject: AuthProvider, pModel: any): Promise<AuthProvider> => {
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
            return dbObject.data() as AuthProvider;
        } catch (err) {
            throw err;
        }
    };

    getById = async (pId: string): Promise<AuthProvider> => {
        try {
            let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
            const dbDoc = await admin.firestore().doc(dbDocRef).get();
            if (dbDoc.exists) {
                const dbObject = dbDoc.data() as AuthProvider | undefined;
                return dbObject;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    getAllByProviderUserId = async (pUserId: string, pProvider?: string, associateUser?: boolean
    ): Promise<AuthProvider[]> => {
        try {
            let provider = pProvider ? pProvider : FirestoreConstant.AuthProvider.PROVIDERS.google;
            if (associateUser) {
                // query = _.merge(query, { include: [User] });
            }
            // console.info("getByProviderUserId refpoint: ", pUserId, provider, associateUser);

            let dbObjects = [];
            let dbobjectFn = admin.firestore().collection(this.mRefPoint).where(FirestoreConstant.AuthProvider.property.providerUserId, "==", pUserId)

            if (pProvider) {
                dbobjectFn = dbobjectFn.where(FirestoreConstant.AuthProvider.property.provider, "==", provider)
            }
            //  console.info("getByProviderUserId 2: ", dbobjectFn);

            const dbCollection = await dbobjectFn.get()
                .then((querySnapshot) => {

                    console.info("getByProviderUserId 3: ", querySnapshot.size);

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
