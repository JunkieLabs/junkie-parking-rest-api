import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { Wheeler } from "../models/wheeler";

export class FirestoreDbWheeler {
  mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.wheeler);
  add = async (pModel: Wheeler): Promise<Wheeler> => {
    try {
      let fieldValue = admin.firestore.FieldValue;
      const dbDoc = admin.firestore().collection(this.mRefPoint).doc(`${pModel.type}`);
      let model = pModel;
      // model = _.merge(model, {
      //   id: dbDoc.id,
      //   cts: fieldValue.serverTimestamp(),
      //   uts: fieldValue.serverTimestamp(),
      // });
      await dbDoc.set(model);
      let dbObject = await dbDoc.get();
      return dbObject.data() as Wheeler;
    } catch (error) {
      throw new Error(error);
    }
  };

  updateSelf = async (pDbObject: Wheeler, pModel: any): Promise<Wheeler> => {
    try {


      let fieldValue = admin.firestore.FieldValue
      let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pDbObject.type);
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
      return dbObject.data() as Wheeler;
    } catch (err) {
      throw err;
    }
  };

  getByType = async (pType: number): Promise<Wheeler> => {
    try {
      let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pType);
      const dbDoc = await admin.firestore().doc(dbDocRef).get();
      if (dbDoc.exists) {
        const dbObject = dbDoc.data() as Wheeler | undefined;
        return dbObject;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  getAll = async (): Promise<Wheeler[]> => {
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
