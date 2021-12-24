import EnvConfig from './../../configs/env.config';
// import config from './../config';

export class FirestoreDbRef {
  static REF = {
    _base: {
      parkingAccount: "parkingAccounts",
      parkingArea: "parkingAreas",
      vehicle: "vehicles",
      users: "users",
      guard: "guards",
      manager: "managers",
      admin: "admins",
      qrCode: "qrCodes",
      subscription: "subscriptions",
      checkInOut: "checkInOuts",
      authProvider: "authProviders",
      wheeler: "wheelers",

    },
  };

  static getRefPoint = (subRef: string) => {
    return EnvConfig.firestoreDbRef() + "/" + subRef;
  };

  static mergeKey = (base: string, subRef: string, key: string) => {
    return base + "/" + key + "/" + subRef;
  };

  static getRef = () => {
    return EnvConfig.firestoreDbRef();
  };

  static getRefPointWithId = (ref: string, pId: any) => {
    return ref + "/" + pId;
  };
};
