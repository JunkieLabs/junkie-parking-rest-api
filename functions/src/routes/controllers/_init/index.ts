import * as  Express from 'express';

import * as HttpErrors from "http-errors";
import { check, validationResult, body, query } from "express-validator";
// // Routes
// import AddRoutes from './add';
import { ApiEngine } from '../../../apps/base/apiEngine';
import _ = require('lodash');
import { InitHandler } from '../../../components/_init/init.handler';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerInit {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
        ) {            
      }


      private mInitHandler: InitHandler = new InitHandler(this.engine);

      init = async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
      ) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
              let error = _.first(errors.array());
              const errValidation = {
                code: 400,
                message: error['msg'] +" "+ error['param'],
                errors: errors.array(),
              };
              console.info(errors);
              next(errValidation);
      
              return
            }
            let { token } = req.body;
            if (token !== 'Ve3wwehVGSXlVbGRqUldoUVYwWg==') {
              // console.log("token: ", HttpErrors(401, 'Pleasa'));
      
              next(HttpErrors(401, 'Pleasa'))
              return
            }
    
    
         
          await this.mInitHandler.initialize();
    
        //  if(dbObjectCommentLike['e']){
        //    result = _.merge( result, {e:dbObjectComment['e']})
        //  }
    
    
    
          res.status(200).json({});
        } catch (e) {
          console.error(e);
    
          next(e);
        }
      };  
};
