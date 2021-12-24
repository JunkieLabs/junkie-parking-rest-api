import * as  Express from 'express';

// // Routes
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerVehicleAdd } from './add';
import { ControllerVehicleUpdate } from './update';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerVehicle {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    addController = new ControllerVehicleAdd(this.app, this.engine);
    updateController = new ControllerVehicleUpdate(this.app, this.engine);
};
