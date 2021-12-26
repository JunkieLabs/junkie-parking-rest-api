import * as  Express from 'express';
import * as _ from 'lodash';

// Files
// import {MongoDbUser} from './../mongoDb/interface'
import { ApiEngine } from '../../apps/base/apiEngine';
import { FirebaseToken } from '../../components/firebase/token/verifyToken';


// Interfaces




export class UserFind {


    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {

    }


    //TODO dbUsers = new MongoDbUser(this.expressComponents.mongoDb)


    findUser = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

        try {


            let token = req.headers['authorization'];

            if (_.isEmpty(token)) {
                res.status(401).json('Verification not found');
                return
            }

            // Get Token String
            if (token.includes('bearer') || token.includes('Bearer')) {
                token = token.split(' ')[1];
            } else {
                res.status(400).json('Malformed authorization');
                return
            }

            /* Verify Id Token */
            let userVerify = await FirebaseToken.verifyFbIdToken(token);
            // console.log('User Verify: ', userVerify);


            if (!_.isEmpty(userVerify.error)) {
                res.status(401).json(userVerify.error);
                return
            }


            /*------ Checking User ------*/

            /*
    
            TODO 
            let dbObject = await this.dbUsers.getByPUID(userVerify['uid']);
            let model = _.omit(dbObject,"password")
            // console.log('Check User Account: ', model);
    
            if (_.isEmpty(model)) {
                return res.status(401).json('Invalid User');     
            }
    
    
            req['user'] = model;
            // req.user.role = user.role;
            */
            req['user'] = {
                puid: userVerify.uid,
            }
            next();


        } catch (e) {
            next(e);

        }

    }
}
