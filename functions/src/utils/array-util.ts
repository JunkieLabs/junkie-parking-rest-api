// import { ObjectID } from "mongodb";


export class ArrayUtil {
    static indexOf(data: any[], object: any, keyCheck: string) {
        if (!(data) || data.length <= 0)
            return -1;
        if (!(object))
            return -1;

        for (let index = 0; index < data.length; index++) {
            let element = data[index];
            if (element[keyCheck] == object[keyCheck]) {
                return index;
            }

        }
        return -1;
    }

    static indexOfVal(data: any[], val: string | String, keyCheck: string) {
        if (!(data) || data.length <= 0)
            return -1;
        if (!(val))
            return -1;

        for (let index = 0; index < data.length; index++) {
            let element = data[index];
            if (element[keyCheck] == val) {
                return index;
            }

        }
        return -1;
    }

    static filtered(data: any[], vals: any[], keyCheck: string): any[] {
        if (!(data) || data.length <= 0)
            return [];
        let filteredItems = []

        if (!(vals)) {
            // data.forEach(element => {
            //     filteredItems.push(element)
            // });
            return [];

        }

        for (let index = 0; index < data.length; index++) {
            let element = data[index];

            let selectedVals = vals.find(val => val == element[keyCheck])

            if (selectedVals) {
                filteredItems.push(element)
            }




        }
        return filteredItems;
    }

    // static indexOfObjectId(data: any[], val: ObjectID, keyCheck: string) {
    //     if (!(data) || data.length <= 0)
    //         return -1;
    //     if (!(val))
    //         return -1;

    //     for (let index = 0; index < data.length; index++) {
    //         let element = data[index];
    //         if (element[keyCheck].equals(val)) {
    //             return index;
    //         }

    //     }
    //     return -1;
    // }

    // static objectIdindex(data: ObjectID[], val: ObjectID) {
    //     if (!(data) || data.length <= 0)
    //         return -1;
    //     if (!(val))
    //         return -1;

    //     for (let index = 0; index < data.length; index++) {
    //         let element = data[index];
    //         if (element.equals(val)) {
    //             return index;
    //         }

    //     }
    //     return -1;
    // }

}
