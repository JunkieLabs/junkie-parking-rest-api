import * as admin from "firebase-admin";

export interface Guard {
    id?: string; //id
    uid: string;
    
    /** parkingAccountId */
    parkingAccountId?: string; //id
   
    /** name */
    name?: string;
    
    /** email */
    email?: string;
    
    /** avatar url */
    avatarUrl?: string;
    
    /** parking area Id */
    parkingAreaId?: string; 
    
    /** status */
    status: number;

    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

