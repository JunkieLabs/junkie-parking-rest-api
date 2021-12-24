import * as  Express from 'express';

// // Routes
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerQrCodeAdd } from './add';
import { ControllerQrCodeGet } from './get';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerQrCode {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    addBulkController = new ControllerQrCodeAdd(this.app, this.engine);
    getController = new ControllerQrCodeGet(this.app, this.engine);
};
