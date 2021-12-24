export class ConfigConstant {


  static PAGINATION = {
    limit: 10,
  };

  static AUTH = {
    verificationType: {
      guard: 'guard'
    },
    authType: {
      google: "google",
    },
  };


  static CHECKINOUT = {
    STATUS: {
      active: 0x0,
      completed: 0x1,
    },
  };

  static ENTITYTYPE = {
    vehicle: "vehicle",
  };


  static WHEELER_TYPE = {
    wheeler2: 1,
    wheeler4: 2,
  }
  static WHEELER_RATE = {
    "1": 100,
    "2": 400,
  }

  static PARKING_ACCOUNT_DEFAULT = "Junkie Park"


}
