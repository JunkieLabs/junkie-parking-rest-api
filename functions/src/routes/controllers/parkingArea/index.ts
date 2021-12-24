import * as  Express from 'express';

// // Routes
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerParkingAreaAdd } from './add';
import { ControllerParkingAreaGet } from './get';
import { ControllerParkingAreaUpdate } from './update';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerParkingArea {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    getController = new ControllerParkingAreaGet(this.app, this.engine);
    addController = new ControllerParkingAreaAdd(this.app, this.engine);
    updateController = new ControllerParkingAreaUpdate(this.app, this.engine);
};
