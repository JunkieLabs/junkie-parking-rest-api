import * as admin from 'firebase-admin';


export class FirebaseToken {

    /**
 * Firebase verify idToken
 */
    static verifyFbIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {

        return admin.auth().verifyIdToken(idToken)
    };


    static createCustomToken(uid: string): Promise<String> {
        // console.log("tokend uis:", uid);


        return admin.auth().createCustomToken(uid)
    };
}


// export default {
//     verifyFbIdToken: verifyFbIdToken,
//     createCustomToken: createCustomToken
// };