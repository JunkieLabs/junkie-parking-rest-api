import { WheelerRate } from "../../engines/firestore/models/parkingArea";

export interface ModelParkingAreaCreator {
    name: string;
    /**
     * parking account id
     */
    pAcId: string;
    /**
     *  guards
     */
    guards: string[];
    rates: WheelerRate[];
}

