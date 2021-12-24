import * as  Express from 'express';

// // Routes
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerGuardGet } from './get';
import { ControllerGuardUpdate } from './update';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerGuard {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    updateController = new ControllerGuardUpdate(this.app, this.engine);
    getController = new ControllerGuardGet(this.app, this.engine);
};
