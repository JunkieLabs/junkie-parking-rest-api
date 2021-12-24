export class Bitwise {

    /**
     * @param {number} originalValue
     * @param {number} maskValue
     * @param {number} checkFor
     * @return {boolean} 
     */
    static containsValue (originalValue: number, maskValue: number, checkFor: number): boolean {
        // console.log("mask: ", originalValue , maskValue);
        // console.log("masked: ", (originalValue & maskValue), checkFor);
        return ((originalValue & maskValue) === checkFor)
    }


    /**
     * @param {number} value
     * @param {number} maskValue
     * @return {number}
     */
    static clearValue (value:number, maskValue:number):number {
        return ((value & ~maskValue) & maskValue)
    }


    /**
     * @param {number} originalValue
     * @param {number} maskValue
     * @param {number} attachValue
     * @return {number}
     */
    static attachValue(originalValue:number, maskValue: number, attachValue: number): number{
        return ((originalValue & ~maskValue) | attachValue)
    }

    
    /**
     * @param {number} originalValue
     * @param {number} maskValue
     * @return {number}
     */
    static getValue(originalVal: number, maskVal: number): number{
        return ((originalVal & maskVal))
    }

}
