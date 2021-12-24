/* eslint-disable no-var */
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import * as  Express from 'express';
import { body, validationResult } from 'express-validator';
import * as HttpErrors from "http-errors";
import _ = require('lodash');

// // Routes
// import AddRoutes from './add';
import { ApiEngine } from '../../../apps/base/apiEngine';
import { AuthCommon } from '../../../components/auth/common.auth';
import { FirebaseToken } from '../../../components/firebase/token/verifyToken';
import { GuardCreator } from '../../../components/guard/creator';
import { ConfigConstant } from '../../../configs/constants.config';
import { FirestoreConstant } from '../../../engines/firestore/constants.firestore';
import { FirestoreDbAdmin } from '../../../engines/firestore/interface/admin';
import { FirestoreDbAuthProvider } from '../../../engines/firestore/interface/authProvider';
import { FirestoreDbGuard } from '../../../engines/firestore/interface/guard';
import { FirestoreDbManager } from '../../../engines/firestore/interface/manager';
import { FirestoreDbParkingAccount } from '../../../engines/firestore/interface/parkingAccount';
import { FirestoreDbParkingArea } from '../../../engines/firestore/interface/parkingArea';
import { FirestoreDbUser } from '../../../engines/firestore/interface/user';
import { FirestoreDbWheeler } from '../../../engines/firestore/interface/wheeler';
import { AuthProvider } from '../../../engines/firestore/models/authProvider';
import { User } from '../../../engines/firestore/models/user';
import { UtilColor } from '../../../utils/colors';
import { ParkingArea } from '../../../engines/firestore/models/parkingArea';
import { Guard } from '../../../engines/firestore/models/guard';

export class ControllerAuthVerify {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) { }


    // db
    mFsDbAuthProvider = new FirestoreDbAuthProvider();
    mFsDbUser = new FirestoreDbUser();
    mFsDbGuard = new FirestoreDbGuard();
    private mFsDbParkingArea = new FirestoreDbParkingArea();
    private mFsDbParkingAccount = new FirestoreDbParkingAccount();

    private mFsDbWheeler = new FirestoreDbWheeler();

    mGuardCreator = new GuardCreator();

    verify = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        try {
            //   console.info("Ffd: ", req.body)
            await body("token").isAscii().not().isEmpty().run(req)
            await body("verificationType").isAscii().not().isEmpty().run(req)

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

            // const { id }  = req.params
            let { token, verificationType, personName } = req.body;
            // console.log("token: ");
            let decodedToken = await FirebaseToken.verifyFbIdToken(token)

            // console.info("decodedToken: ", decodedToken);

            // let result

            // console.log("hreq");
            if (ConfigConstant.AUTH.verificationType.guard !== verificationType) {
                // console.log("hre");
                next(HttpErrors(401, 'Invalid verification Type'))
                return
            }

            let signInProvider = decodedToken.firebase.sign_in_provider
            let dbObjectAuthProviders = await this.mFsDbAuthProvider.getAllByProviderUserId(decodedToken.uid, signInProvider, true)

            let email = undefined
            let name = undefined
            let avatar = undefined

            let identifire = ""



            name = decodedToken.name || personName || "user";

            if (decodedToken.picture) {
                avatar = decodedToken.picture
            } else {
                avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${UtilColor.getRandomThumbnailBg()}&rounded=true&size=128&color=ffffff&bold=true`;
            }


            if (signInProvider == FirestoreConstant.AuthProvider.PROVIDERS.google) {
                identifire = decodedToken.email
                email = decodedToken.email
            }

            // console.info("dbObjectAuthProvider 1: ", signInProvider)

            let dbObjectUser: User
            if (!dbObjectAuthProviders || dbObjectAuthProviders.length == 0) {
                let pModelUser: User = {
                    roles: [],
                    status: 0,
                }
                if (name) {
                    pModelUser = _.merge(pModelUser, { name: name })
                }
                dbObjectUser = await this.mFsDbUser.add(pModelUser)
                console.log('📌 🟢 dbObjectUser', dbObjectUser);
            } else {
                console.log('##############------ already created -------');
                console.log('auth provider uid', dbObjectAuthProviders);
                dbObjectUser = await this.mFsDbUser.getById(dbObjectAuthProviders[0].uid);
                console.log('##############');
                console.log('when already user created', dbObjectUser);
            }

            let dbObjectAuthProvider: AuthProvider;

            dbObjectAuthProviders.forEach(element => {
                if (element.provider == signInProvider) {
                    dbObjectAuthProvider = element
                }
            });

            if (!dbObjectAuthProvider) {
                let pModelAuthProvider: AuthProvider = {
                    uid: dbObjectUser.id,
                    identifier: identifire,
                    providerUserId: decodedToken.uid,
                    provider: signInProvider,
                    status: 0,
                }
                dbObjectAuthProvider = await this.mFsDbAuthProvider.add(pModelAuthProvider)
            }



            let result = {
                user: null,
                admin: null,
                manager: null,
                guard: null,
            }
            let role = AuthCommon.getRoleForVerificationType(verificationType);


            if (!dbObjectUser?.roles.includes(role)) {
                console.log('came to check role---', role);

                if (role == FirestoreConstant.User.ROLE.GUARD) {
                    console.log('------create guard------', dbObjectUser, role);
                    var dbObjectGuard = await this.mGuardCreator.create(dbObjectUser, {
                        avatarUrl: avatar,
                        name: name,
                        email: email,
                    })
                    if (!dbObjectGuard.parkingAreaId) {
                        dbObjectGuard = await this.assignParkingArea(dbObjectGuard);
                    }
                    result.guard = _.omitBy(dbObjectGuard, _.isNil)
                }
            } else {
                console.log('------found the user and role------', dbObjectUser, role);
                if (role == FirestoreConstant.User.ROLE.GUARD) {

                    dbObjectGuard = await this.mFsDbGuard.getByUID(dbObjectUser.id)
                    if (!dbObjectGuard.parkingAreaId) {
                        dbObjectGuard = await this.assignParkingArea(dbObjectGuard);
                    }
                    result.guard = _.omitBy(dbObjectGuard, _.isNil)

                }
            }




            result.user = _.omitBy(dbObjectUser, _.isNil)




            // console.info("result user:", result.user);

            // console.info("dbt2", moment().valueOf());
            res.status(200).json(result);
        } catch (e) {
            console.error(e);

            next(e);
        }
    };


    assignParkingArea = async (dbObjectGuard: Guard) => {
        let dbObjectParkingArea = await this.mFsDbParkingArea.getAvailableForGuard();

        if (!dbObjectParkingArea) {

            let dbParkingAccount = await this.mFsDbParkingAccount.getByName(ConfigConstant.PARKING_ACCOUNT_DEFAULT);


            var name = uniqueNamesGenerator({ dictionaries: [adjectives, colors] })

            let dbObjectWheelers = await this.mFsDbWheeler.getAll()

            let wheelerRates = dbObjectWheelers.map(entity => _.merge(entity, {

                rate: ConfigConstant.WHEELER_RATE[entity.type.toString()],
            }))
            let pModelArea: ParkingArea = {
                name: name,
                parkingAccountId: dbParkingAccount.id,
                guards: [],
                guardsCount: 0,
                rates: wheelerRates,
                status: 0,
            };

            dbObjectParkingArea = await this.mFsDbParkingArea.add(pModelArea);


        }

        if (!dbObjectParkingArea) {
            throw HttpErrors(404, "ParkingArea Not found");
        }

        let pModelParkingArea = {
            guards: dbObjectParkingArea.guards,
        };


        pModelParkingArea.guards.push(dbObjectGuard.id)


        let pModelGuard = {
            parkingAccountId: dbObjectParkingArea.parkingAccountId,
            parkingAreaId: dbObjectParkingArea.id,
        };

        let dbObjectGuardUpdated = await this.mFsDbGuard.updateSelf(dbObjectGuard, pModelGuard);
        await this.mFsDbParkingArea.updateSelf(dbObjectParkingArea, pModelParkingArea);
        await this.mFsDbParkingArea.incrementGuardsCount(dbObjectParkingArea.id, 1);
        return dbObjectGuardUpdated;

    }




}
