import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvSafe from 'dotenv-safe';
// import EnvConfig from './configs/env.config'

export default {

    init: () => {

        // Environment Directory
        // console.log(path.join(__dirname, '.env'));

        // Environment Setup
        console.log('--- Environment Setup Ready ---');
        // console.log('Node env is: ', process.env.NODE_FC_ENV);
        const configPath = path.join(__dirname, './../.env');
        console.info('Node env 2: ', configPath);


        const result = dotenv.config({ path: configPath, });

        // console.log("result:", result);

        dotenvSafe.config({ allowEmptyValues: true });
        // console.log(result);

        //console.log('dotenv isProduction?: ', EnvConfig.isProduction());
        // console.log('Firebase DB Ref: ', EnvConfig.firebaseDbRef());

    }
}