import * as admin from "firebase-admin";

export interface Manager {
    id?: string; //id
    uid: string; //uid

    /** parkingAccount */
    parkingAccountId?: string; //id
   
    /** name */
    name?: string;
    
    /** parking area Ids */
    parkingAreaIds: string[]; //ids

    /** email */
    email?: string;
    
    /** avatarUrl */
    avatarUrl?: string;
    
    /** status */
    status: number;
    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

