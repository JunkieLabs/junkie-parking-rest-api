import * as Express from "express";
import * as _ from "lodash";
import * as admin from "firebase-admin";
import * as HttpErrors from "http-errors";
import { body, validationResult } from "express-validator";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { FirestoreDbParkingAccount } from "../../../engines/firestore/interface/parkingAccount";
import { FirestoreDbParkingArea } from "../../../engines/firestore/interface/parkingArea";
import { FirestoreDbQrCode } from "../../../engines/firestore/interface/qrCode";
import { FirestoreDbCheckInOut } from "../../../engines/firestore/interface/checkInOut";
import { FirestoreDbVehicle } from "../../../engines/firestore/interface/vehicle";
import { FirestoreConstant } from "../../../engines/firestore/constants.firestore";
import { CheckInOut } from "../../../engines/firestore/models/checkInOut";
import { Vehicle } from "../../../engines/firestore/models/vehicle";
import { FirestoreDbWheeler } from "../../../engines/firestore/interface/wheeler";
import { PriceCalculator } from "../../../utils/priceCalculator";
import { FirestoreDbGuard } from "../../../engines/firestore/interface/guard";

export class ControllerCheckInOutPost {

    // Db Model
    private mFsQrCode = new FirestoreDbQrCode()
    private mFsDbGuard = new FirestoreDbGuard()
    private mFsDbVehicle = new FirestoreDbVehicle()
    private mFsDbCheckInOut = new FirestoreDbCheckInOut()
    private mFsDbParkingAccount = new FirestoreDbParkingAccount();
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbWheeler = new FirestoreDbWheeler();



    constructor(private app: Express.Application, private engine: ApiEngine) { }


    create = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        try {
            await body("vehicleNumber").isAscii().run(req);
            // await body("phone").isMobilePhone("en-IN").run(req);
            await body("parkingAreaId").isAscii().run(req);
            await body("wheelerType").isNumeric().run(req);
            await body("guardId").isAscii().run(req);


            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.info("error: ", errors)
                let error = _.first(errors.array());
                const errValidation = {
                    code: 400,
                    message: error['msg'] + " " + error['param'],
                    errors: errors.array(),
                };
                next(errValidation);

                return
            }


            let { parkingAreaId, vehicleNumber, wheelerType, guardId } = req.body

            console.info("ControllerCheckInOutPost craete 1")

            let dbObjects = await Promise.all([this.mFsDbParkingArea.getById(parkingAreaId), 
                this.mFsDbVehicle.getByNumber(vehicleNumber),
            this.mFsDbCheckInOut.getActive(vehicleNumber), 
            this.mFsDbGuard.getById(guardId)])

            let dbObjectGuard = dbObjects[3];
            if (!dbObjectGuard) {
                next(HttpErrors(404, 'Guard Not found'))
                return
           }

            
            let dbobjectParkingArea = dbObjects[0]
            if (!dbobjectParkingArea) {
                 next(HttpErrors(404, 'Parking Area Not found'))
                 return
            }

            if(dbObjectGuard.parkingAreaId != dbobjectParkingArea.id){
                next(HttpErrors(401, 'Invalid Guard'))
                return
            }

            console.info("ControllerCheckInOutPost craete 2")
            let dbObjectVehicle = dbObjects[1]

            let dbObjectCheckInOut = dbObjects[2]

            if (!dbObjectVehicle) {
                let { email, name, phone} = req.body
                console.info("ControllerCheckInOutPost craete 3")

                var dbObjectWheeler = await this.mFsDbWheeler.getByType(wheelerType)
                if (!dbObjectWheeler) {
                   next(HttpErrors(400, 'Invalid request'))
                   return
                } 
                let pModelVehicle: Vehicle = {
                    name: name,
                    email: email,
                    phone: phone,
                    number: vehicleNumber,
                    wheeler: dbObjectWheeler
                }

                dbObjectVehicle = await this.mFsDbVehicle.add(pModelVehicle)

                let pModelQrCode = {
                    entity: dbObjectVehicle.id,
                    entityType: FirestoreConstant.QrCode.entityType.vehicle
                    //TODO -- add code nanoid
                }
                let qrCode = await this.mFsQrCode.add(pModelQrCode)

                dbObjectVehicle.qrCodeId = qrCode.id
                dbObjectVehicle.qrCode = qrCode.code
                //TODO  add qrcode to model vehicle 
                dbObjectVehicle = await this.mFsDbVehicle.updateSelf(dbObjectVehicle, {
                    qrCodeId: qrCode.id,
                    qrCode: qrCode.code
                })

                console.info("ControllerCheckInOutPost craete 4")

            }


            if (dbObjectCheckInOut) {

                console.info("ControllerCheckInOutPost craete 5")

                if(dbObjectCheckInOut.parkingAreaId!= dbobjectParkingArea.id){
                    next(HttpErrors(401, 'Not authorized for this'))
                    return
                 
                }
                console.info("ControllerCheckInOutPost craete 6")


                if(dbObjectVehicle.wheeler.type != wheelerType){
                    next(HttpErrors(400, 'Invalid vehicle type'))
                    return
                }
                //TODO do checkout 
                // return next(HttpErrors(400, 'Ticket alredy exist'))


                var current =  admin.firestore.Timestamp.now().toMillis();

                let pModel = {
                    status: FirestoreConstant.CheckInOut.status.COMPLETED,
                    finalAmount: PriceCalculator.calculate(current, dbObjectCheckInOut.its.toMillis(), dbObjectCheckInOut.wheelerRate)

                    // finalAmount: 0,
                    // paidAmountSubscription: 0
                }
                console.info("ControllerCheckInOutPost craete 7")


                dbObjectCheckInOut = await this.mFsDbCheckInOut.checkout(dbObjectCheckInOut, pModel)
            } else {

                console.info("ControllerCheckInOutPost craete 8")


                var wheelerRate = dbobjectParkingArea.rates.find(rate =>  rate.type == dbObjectVehicle.wheeler.type)
                if (!wheelerRate) {
                    return next(HttpErrors(400, 'Invalid request'))
                } 
                var pModel : CheckInOut = {
                    vehicleId: dbObjectVehicle.id,

                    guardId: dbObjectGuard.id,
                
                    parkingAccountId: dbobjectParkingArea.parkingAccountId,
                    parkingAreaId: dbobjectParkingArea.id,
                    vehicleNumber: dbObjectVehicle.number,
                    qrCode: dbObjectVehicle.qrCode, //TDOD replace with qrcodeID
                    qrCodeId: dbObjectVehicle.qrCodeId,
                    wheelerRate: wheelerRate,
                   status : FirestoreConstant.CheckInOut.status.ACTIVE
    
                }
                dbObjectCheckInOut = await this.mFsDbCheckInOut.add(pModel)
            }
            console.info("ControllerCheckInOutPost craete 10")


            dbObjectCheckInOut.inTimestamp = dbObjectCheckInOut.its.toMillis()
            if(dbObjectCheckInOut.ots){
                dbObjectCheckInOut.outTimestamp = dbObjectCheckInOut.ots.toMillis()
            }

            let result = _.omitBy(dbObjectCheckInOut, _.isNil);
            console.info("ControllerCheckInOutPost craete 11")

            res.status(200).json({
                checkInOut: result,
                vehicle: dbObjectVehicle
          });
          return;

        } catch (e) {
            console.error(e);

            next(e);
        }
    }

}