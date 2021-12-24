import * as  Express from 'express';

// // Routes
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerParkingArea } from './parkingArea';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerReport {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    parkingAreaController = new ControllerParkingArea(this.app, this.engine);
};
