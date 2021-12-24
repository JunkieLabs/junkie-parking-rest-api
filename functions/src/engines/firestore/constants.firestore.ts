import { ConfigConstant } from "../../configs/constants.config";

export class FirestoreConstant {
  






  static COMMON = {
    property: {
      id: "id",
      cts: "cts",
      uts: "uts",
    },
  };

  static AuthProvider = {
    property: {
      provider: "provider",
      providerUserId: "providerUserId",
    },

    TYPE: {
      firebase: 0x1,
    },
    PROVIDERS: {
      google: "google.com",
    },
  };

  static ParkingAccount = {
    property: {
      name: "name",
    }
  }

  static ParkingArea = {
    property: {
      guardsCount: "guardsCount",
    }
  }

  static User = {
    ROLE: {
      ADMIN: 0x1,
      GUARD: 0x2,
      MANAGER: 0x4,

    },

  };

  static Admin = {
    property: {
      userId: "uid",
    },
  };


  static Manager = {
    property: {
      userId: "uid",
    },
  };


  static Guard = {
    property: {
      userId: "uid",
    },
  };

  static WHEELER = {
    property: {
      type: "type",
    },

    getTyreCount: (type: number): number => {
      if (type == 0x1) {
        return 2;
      } else if (type == 0x2) {
        return 4;
      }

      return 0;
    },

    TYPE: {
      bike: 0x1,
      car: 0x2,
    },

  };

  static CheckInOut = {
    property: {
      vehicleNumber: "vehicleNumber",
      parkingAccountId: "parkingAccountId",
      parkingAreaId: "parkingAreaId",
      qrCode: "qrCode",
      its: "its",
      ots: "ots",
      status: "status",
    },
    status: {
      ACTIVE : 0x0,
      COMPLETED : 0x1
    }

  }

  static QrCode = {
    property: {
      code: "code",

    },
    entityType: {
      vehicle :1 
    }
  }

  static Vehicle = {
    property: {
      name: "name",
      number: "number",
      qrCode: "qrCode",

    }
  }

  static Subscription = {
    property: {
      vehicleNumber: "vehicleNumber",
      qrCode: "qrCode",

    }
  }

}
