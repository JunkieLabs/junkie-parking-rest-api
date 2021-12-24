import * as  Express from 'express';

// // Routes
// import AddRoutes from './add';
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerParkingAccountAdd } from './add';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerParkingAccount {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    addController = new ControllerParkingAccountAdd(this.app, this.engine);
};
