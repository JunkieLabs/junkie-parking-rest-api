import * as  Express from 'express';
import { HttpError } from 'http-errors';
// import logger from './../utils/logger';


export default function errorHandler(err: HttpError, req: Express.Request, res: Express.Response, next: Express.NextFunction) {

    // logger.info("*********************** errorHandler started **********************");
    console.error("*********************** errorHandler started **********************");


    // console.log("working error : ", err);
    if (!err) {

        // console.log("working error 2: ", err);
        return res.sendStatus(500);
    }


    const error: any = {
        message: err.message || 'Internal Server Error.',
        code: 500,
        statusCode: 500,
    };

    // if (EnvConfig.isProduction()) {
    //     error.stack = {};
    // } else {
    //     error.stack = err.stack;
    // }
    error.stack = err.stack;
    // if (process.env.RUN_MODE==='dev') {
    //   error.stack = err.stack;
    // }

    if (err.errors) {

        error.errors = {};

        const { errors } = err;

        for (const type in errors) {
            if (type in errors) {
                error.errors[type] = errors[type].message;
            }
        }
    }

    console.log(err);
    //log.info("dede");
    //res.status(err.status || 500).json(error);
    // logger.debug(" error middleware {}", err);
    console.error(" error middleware {}", err);

    error.code = err.statusCode || err.code || 500

    if (isNaN(error.code)) {
        error.code = 500

    }
    error.statusCode = error.code
    console.error(" error middleware {2}", error);



    return res.status(error.code).json(error);

}