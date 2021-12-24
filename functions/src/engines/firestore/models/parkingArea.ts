import * as admin from "firebase-admin";
import { Wheeler } from "./wheeler";

export interface ParkingArea {
  
  id?: string;
  name?: string;
  
  /** parkingAccountId */
  parkingAccountId?: string; //id

  /** wheeler rates */
  rates: WheelerRate[];
  
  guards: string[],
  guardsCount: number;

  /**  status */
  status: number;
  uts?: admin.firestore.Timestamp;
  cts?: admin.firestore.Timestamp;
}

export interface WheelerRate{ 
   
  /** type */
   type: number

   /** tyre count  */
   tyreCount: number;
 
   /** label */
   label?: string;
 
   /**  rate */
   rate?: number;
   
}

