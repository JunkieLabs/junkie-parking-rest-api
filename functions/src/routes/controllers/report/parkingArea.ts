import * as Express from "express";
import * as admin from "firebase-admin";
import { body, query, validationResult } from "express-validator";
import * as _ from "lodash";
import { ApiEngine } from "../../../apps/base/apiEngine";
import { ReportCreator } from "../../../components/report/creator";
import { FirestoreDbCheckInOut } from "../../../engines/firestore/interface/checkInOut";
import { FirestoreConstant } from "../../../engines/firestore/constants.firestore";
import { ModelReportParkingWheeler } from "./models";


// // Routes

export class ControllerParkingArea {
    constructor(private app: Express.Application, private engine: ApiEngine) { }

    // Db Model
    private mFsDbCheckInOut = new FirestoreDbCheckInOut();
    private mReportCreator = new ReportCreator();

    getReport = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            await query("parkingAreaId").isAscii().run(req);

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
            let { parkingAreaId } = req.query;

            let endTimestamp = admin.firestore.Timestamp.now();

            let dateStart = new Date(endTimestamp.toDate());

            dateStart.setDate(endTimestamp.toDate().getDate() - 1);
            let startTimestamp = admin.firestore.Timestamp.fromDate(dateStart);
            // let startTimestamp = admin.firestore.Timestamp.fromDate(dateStart)
            // let endTimestamp = admin.firestore.Timestamp.fromDate(dateStart)
            // .toMillis();

            //if Date range is not given use 24hrs by default

            //   if (!parkingAreaId) {
            //     return next(HttpErrors(400, "Parking area id is Required"));
            //   }

            // status = status === null || status === undefined || isNaN(status) ? 1 : parseInt(status);

            // dateStart = _.isEmpty(dateStart) || isNaN(dateStart) ? defaultStartDate :parseInt(dateStart);
            // dateEnd = _.isEmpty(dateEnd) || isNaN(dateEnd) ? defaultEndDate : parseInt(dateEnd);

            // wheeler = wheeler === null || wheeler === undefined || isNaN(wheeler) ? null : parseInt(wheeler);

            console.info("parking Area: ", parkingAreaId)
            let dbObjects = await this.mFsDbCheckInOut.getAllByQuery(null, null, null,
                parkingAreaId as string, FirestoreConstant.CheckInOut.status.COMPLETED,
                startTimestamp, endTimestamp);
                console.info("parking Area: ", dbObjects.length)



            let wheelerReportMap = new Map<Number, ModelReportParkingWheeler>();

            for (let i = 0; i < dbObjects.length; i++) {
                let dbObjectCheckInOut = dbObjects[i];
                let type = dbObjectCheckInOut.wheelerRate.type

                let wheelerReport: ModelReportParkingWheeler
                if (wheelerReportMap.get(type)) {
                    wheelerReport = wheelerReportMap.get(type);
                    wheelerReport.amount += dbObjectCheckInOut.finalAmount
                    wheelerReport.total++

                } else {
                    wheelerReport = {
                        amount: dbObjectCheckInOut.finalAmount,
                        total: 1,
                        wheelerType: dbObjectCheckInOut.wheelerRate.type

                    }
                    wheelerReportMap.set(type, wheelerReport);
                }

            }

            console.info("wheelerReportMap: ", wheelerReportMap)

            var amount = 0.0
            var total = 0

            // console.log("iter", ...wheelerReportMap.values())
            // console.log("iter", wheelerReportMap.keys())
            var wheelerReports = Array.from(wheelerReportMap.values());
            // console.info("wheelerReports: ", wheelerReports)
            for (let i = 0; i < wheelerReports.length; i++) {
                const wheelerReport = wheelerReports[i];
                amount += wheelerReport.amount
                total += wheelerReport.total


            }
            // dbObjects.filter(dbObject => { dbObject.wheelerRate });

            res.status(200).json({
                amount: amount,
                total: total,
                startTime:dateStart.valueOf(),
                wheelers: wheelerReports
            });
        } catch (e) {
            console.error(e);

            next(e);
        }
    };
}
