import * as admin from 'firebase-admin';

/**
 * New Key Generator 
 */
export default (firebaseDb: admin.database.Database) => {

    /**
     * generate Firebase ref key
     */
    let newKey = async (ref: admin.database.Reference): Promise<string> => {

        try {

            let key = await firebaseDb.ref(ref).push().key;
        
            if (key) {
                return key;
            } else {
                throw new Error("unable to Create Key");
            }


        } catch (err) {

            console.log(err);
            throw err;
        }

    };

    return {
        newKey: newKey,
    }

};
