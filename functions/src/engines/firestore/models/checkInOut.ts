import * as admin from "firebase-admin";
import { WheelerRate } from './parkingArea';
export interface CheckInOut {
    id?: string; //id

    /** ParkingAccount Id */
    parkingAccountId: string; 

    /** vehicle Id */
    vehicleId: string;

    /** parkingArea Id */
    parkingAreaId: string;

    /** vehicleQrcode Id */
    qrCodeId: string;

    guardId: string;
    
    /** statement Id */ 
    statementId?: string;

    finalAmount?: number;

    /** not used */
    paidAmountSubscription?: number;

    its?: admin.firestore.Timestamp;  // in time
    ots?: admin.firestore.Timestamp; // out time


    inTimestamp?: number;  // in time
    outTimestamp?: number; // out time
    
    /** vehicle Number */
    vehicleNumber: string;
    
    /** vehicle QrCode */
    qrCode: string;

    /** wheeler */
    wheelerRate: WheelerRate;

    /** status */
    status: number;
    

    uts?: admin.firestore.Timestamp;
    cts?: admin.firestore.Timestamp;
}

