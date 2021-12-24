import * as admin from "firebase-admin";

export interface Subscription {
    id?: string;

    /** Amount */
    amout: number;

    /** vehicle Id */
    vehicleId: string;

    /** vehicle qrcode Id */
    qrCodeId: string;

    /** email */
    email: string;

    /** phone */
    phone: string;

    /** vehicle number */
    vehicleNumber: string;

    /** vehicle qrcode */
    qrCode: string;
    
    status?: number;
    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

