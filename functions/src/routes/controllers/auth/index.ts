import * as  Express from 'express';

// // Routes
// import AddRoutes from './add';
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerAuthVerify } from './verify';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerAuth {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
        ) {            
      }

      verifyController = new ControllerAuthVerify(this.app, this.engine);   
};
