import * as  Express from 'express';

// // Routes
import { ApiEngine } from '../../../apps/base/apiEngine';
import { ControllerCheckInOutGet } from './get';
import { ControllerCheckInOutPost } from './post';




/**
 * Test Routes Index
 * @param {Express} app - express app
 */
export class ControllerCheckInOut {
    constructor(
        private app: Express.Application,
        private engine: ApiEngine
    ) {
    }

    checkInOutPostController = new ControllerCheckInOutPost(this.app, this.engine);
    checkInOutGetController = new ControllerCheckInOutGet(this.app, this.engine);
};
