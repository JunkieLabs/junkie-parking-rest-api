import * as admin from "firebase-admin";
import { Admin } from "./admin";
import { Guard } from "./guard";
import { Manager } from "./manager";

export interface User {
    id?: string; //id
    // puid: string;

    /** role */
    roles: number[];

    /** guard */
    guard?: Guard; //uuid

    /** manager */
    manager?: Manager; //uuid

    /** admin */
    admin?: Admin; //uuid
    
    /** status */
    status: number;

    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

