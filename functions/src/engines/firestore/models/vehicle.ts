import * as admin from "firebase-admin";
import { Wheeler } from "./wheeler";

export interface Vehicle {
  id?: string; //id
  /** Name  */
  name?: string;

  /** Email */
  email?: string;

  /** Phone */
  phone?: string;

  /** Vehicle Number */
  number?: string;

  /** Wheeler */
  wheeler: Wheeler;

  /** QrCode Id*/
  qrCodeId?: string;

  /** QrCode*/
  qrCode?: string;


  // id?: string; //id
  // phone: string;
  // qrCode?: string; //uuid
  // subscription?: string; //uuid
  // w?: Wheeler;
  // s: number;
  // uts?: admin.firestore.Timestamp;
  // cts?: admin.firestore.Timestamp;
  // subscription?: string; //uuid

  status?: number;
  uts?: admin.firestore.Timestamp;
  cts?: admin.firestore.Timestamp;
}

