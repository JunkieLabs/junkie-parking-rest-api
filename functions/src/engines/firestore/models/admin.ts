import * as admin from "firebase-admin";

export interface Admin {
    id?: string; //id
    uid: string; //id
    
    /** name */
    name?: string;
    
    /** email */
    email?: string;
    
    /** au */
    avatarUrl?: string;
    
    /** status */
    status: number;

    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

