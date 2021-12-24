import { FirestoreDbWheeler } from './../../engines/firestore/interface/wheeler';
import { ModelVehicleCreator } from "./model";
import * as _ from "lodash";
import * as HttpErrors from "http-errors";
import { FirestoreConstant } from "../../engines/firestore/constants.firestore";
import { Vehicle } from "../../engines/firestore/models/vehicle";
import { FirestoreDbVehicle } from "../../engines/firestore/interface/vehicle";

export class VehicleCreator {
    // Db Model
    private mFsDbWheeler = new FirestoreDbWheeler();
    private mFsDbVehicle = new FirestoreDbVehicle();


    create = async (creator: ModelVehicleCreator): Promise<Vehicle> => {

        let pModel: Vehicle = {
            
            wheeler: null,
            status: 0,
        };
        if (creator.wheeler || creator.wheeler === 0) {

            let dbObjectWheeler = await this.mFsDbWheeler.getByType(creator.wheeler)
            if (!dbObjectWheeler) {
                throw HttpErrors(401, 'Invalid Wheeler Type');
            }
            pModel = _.merge(pModel, { w: dbObjectWheeler });
        }

        if (creator.name) {
            pModel = _.merge(pModel, { name: creator.name });
        }
        if (creator.number) {
            pModel = _.merge(pModel, { number: creator.number });
        }
        if (creator.email) {
            pModel = _.merge(pModel, { email: creator.email });
        }
        if (creator.phone) {
            pModel = _.merge(pModel, { phone: creator.phone });
        }

        if (creator.qrCodeId) {
            pModel = _.merge(pModel, { qrCodeId: creator.qrCodeId });
        }

        if (creator.qrCode) {
            pModel = _.merge(pModel, { qrCode: creator.qrCode });
        }

        let dbObjectVehicle = await this.mFsDbVehicle.add(pModel);

        return dbObjectVehicle;
    };
}
