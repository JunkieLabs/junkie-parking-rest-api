import * as _ from 'lodash';


export default {
    
    /**
     * Set Limit & Offset for Query
     * 
     * @return {{offset: number, limit: number}}
     */
    offsetLimit: (pOffset?: any, pLimit? :string) => {

        let offset = (_.isEmpty(pOffset) || isNaN(pOffset)) ? 0 : parseInt(pOffset);

        let limit = 50;
        if (!_.isEmpty(pLimit)) {

            if (pLimit || !isNaN(pOffset)) {

                limit = parseInt(pLimit);
                // Get all data with -1 limit
                if (limit === -1) limit = 1000000000000000;
            }
        }

        return {
            offset: offset,
            limit: limit,
        };
    },


    /**
     * @param {string} pQueryStrings
     */
    queryArrayToArray: (pQueryStrings: string)=>{
        let arr:string[] = [];
        if (pQueryStrings) {
            arr = pQueryStrings.split(',');
            arr = _.uniq(arr);
        } else {
            arr = [];
        }

        return arr;
    },
};