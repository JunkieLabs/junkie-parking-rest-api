import { Vehicle } from './../models/vehicle';
import * as _ from "lodash";
import * as admin from "firebase-admin";
import { FirestoreDbRef } from "../ref";
import { FirestoreConstant } from '../constants.firestore';

export class FirestoreDbVehicle {
  mRefPoint = FirestoreDbRef.getRefPoint(FirestoreDbRef.REF._base.vehicle);
  add = async (pModel: Vehicle): Promise<Vehicle> => {
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
      return dbObject.data() as Vehicle;
    } catch (error) {
      throw new Error(error);
    }
  };

  updateSelf = async (pDbObject: Vehicle, pModel: any): Promise<Vehicle> => {
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
      return dbObject.data() as Vehicle;
    } catch (err) {
      throw err;
    }
  };

  getById = async (pId: string): Promise<Vehicle> => {
    try {
      let dbDocRef = FirestoreDbRef.getRefPointWithId(this.mRefPoint, pId);
      const dbDoc = await admin.firestore().doc(dbDocRef).get();
      if (dbDoc.exists) {
        const dbObject = dbDoc.data() as Vehicle | undefined;
        return dbObject;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };


  getByNumber = async (number: string): Promise<Vehicle> => {
    try {
      let dbObject: Vehicle[] = [];
      const dbObjectThreads = await admin
        .firestore()
        .collection(this.mRefPoint)
        .where(FirestoreConstant.Vehicle.property.number, "==", number)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            dbObject.push(doc.data() as Vehicle);
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

  
  getByQrcode = async (qrCode: string): Promise<Vehicle> => {
    try {
      let dbObject: Vehicle[] = [];
      const dbObjectThreads = await admin
        .firestore()
        .collection(this.mRefPoint)
        .where(FirestoreConstant.Vehicle.property.qrCode, "==", qrCode)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            dbObject.push(doc.data() as Vehicle);
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


  getTestingQuery = async (pNumber?: string, pName?: String, associateArea?: boolean): Promise<Vehicle> => {
    try {
      let dbObject: Vehicle[] = [];
      let dbObjectRef = admin.firestore()
        .collection(this.mRefPoint) as admin.firestore.Query;
      if (pNumber) {
        dbObjectRef = dbObjectRef.where(FirestoreConstant.Vehicle.property.number, "==", pNumber);
      }

      if (pName) {
        dbObjectRef = dbObjectRef.where(FirestoreConstant.Vehicle.property.name, "==", pName);
      }

      let res = await dbObjectRef.get()
      dbObject = res.docs.map<Vehicle>(doc => doc.data() as Vehicle);
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
