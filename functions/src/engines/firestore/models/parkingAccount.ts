import * as admin from "firebase-admin";

export interface ParkingAccount {
    id?: string; //id
    /** name */
    name: string;
    status: number;
    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

