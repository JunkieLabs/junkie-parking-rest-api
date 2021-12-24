import { Wheeler } from "../../engines/firestore/models/wheeler";

export interface ModelVehicleCreator {
    name?: string;
    number: string;
    email: string;
    phone: string;
    wheeler: number;
    qrCode?: string; //qrCode
    qrCodeId?: string; //qrCodeId
    status?: number;
}

