import * as admin from "firebase-admin";

export interface Report {
    id?: string;
    code: string;
    type: string;
    typeEntity: string; //entity
    status: number;
    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

