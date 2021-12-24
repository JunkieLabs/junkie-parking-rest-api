import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { ParkingArea } from "../models/parkingArea";
import { FirestoreUtil } from "../firestore.util";
import { FirestoreConstant } from "../constants.firestore";

export class FirestoreDbParkingArea {
  mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.parkingArea);
  add = async (pModel: ParkingArea): Promise<ParkingArea> => {
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
      return dbObject.data() as ParkingArea;
    } catch (error) {
      throw new Error(error);
    }
  };

  updateSelf = async (pDbObject: ParkingArea, pModel: any): Promise<ParkingArea> => {
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
      return dbObject.data() as ParkingArea;
    } catch (err) {
      throw err;
    }
  };

  getById = async (pId: string): Promise<ParkingArea> => {
    try {
      let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
      const dbDoc = await admin.firestore().doc(dbDocRef).get();
      if (dbDoc.exists) {
        const dbObject = dbDoc.data() as ParkingArea | undefined;
        return dbObject;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  getAvailableForGuard = async (): Promise<ParkingArea> => {
    try {
      let dbObject = [];
      var queryFn = admin
        .firestore()
        .collection(this.mRefPoint)
        .withConverter(FirestoreUtil.converter<ParkingArea>())
        .where(FirestoreConstant.ParkingArea.property.guardsCount, "<", 10)
        .limit(1)




      const response = await queryFn.get()

      if (response.docs != null && response.docs.length > 0) {
        return response.docs.map(doc => doc.data())[0];
      }
      return null;

    } catch (error) {
      throw error;
    }
  }

  

  incrementGuardsCount = async  (pId: string, count: number = 1): Promise<any> => {
    try {
      let fieldValue = admin.firestore.FieldValue
      let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
      const increment = fieldValue.increment(count);

      const dbDoc = await admin.firestore().doc(dbDocRef).update({guardsCount: increment});
      return

    } catch (error) {
      throw error;
    }

  }

  decrementGuardsCount = async  (pId: string, count: number = 1): Promise<any> => {
    try {
      let fieldValue = admin.firestore.FieldValue
      let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
      const increment = fieldValue.increment(-count);

      const dbDoc = await admin.firestore().doc(dbDocRef).update({guardsCount: increment});
      return

    } catch (error) {
      throw error;
    }

  }
}
