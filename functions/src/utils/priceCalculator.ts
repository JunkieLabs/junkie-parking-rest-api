
import { WheelerRate } from '../engines/firestore/models/parkingArea';

export class PriceCalculator {
    static calculate = (inTimeInMillis: number, outTimeInMillis: number, wheelerRate: WheelerRate) => {
        let totalTime;
        let inTime: any = Math.floor(inTimeInMillis / 1000);
        let outTime: any = Math.floor(outTimeInMillis / 1000);
        totalTime = Math.abs(Math.round((outTime - inTime) / 3600));

        if(totalTime==0){
            totalTime = 1
        }
        console.log('📌 🟢', inTime, outTime, totalTime, wheelerRate);
       
        return totalTime * wheelerRate.rate;
    };
}
