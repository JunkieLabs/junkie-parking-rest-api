import * as admin from "firebase-admin";
export interface QrCode {
    id?: string;

    //todo check if required fileds entity
    /** entity */
    entity: string;

    /** entityType */
    entityType: number;

    /** Image Url */
    imageUrl?: string;

    /** code */
    code?: string;

    /** Dynamic Url */
    dynamicUrl?: string;

    status?: number;
    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

