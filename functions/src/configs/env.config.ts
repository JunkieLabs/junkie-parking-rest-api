
export default {

    apiUrl: () => {
        return process.env.API_URL.trim()
    },
    firebaseProject: () => {
        return process.env.FIREBASE_PROJECT.trim()
    },
    firebaseAdmin: () => {
        return process.env.FIREBASE_ADMIN.trim()
    },

    // firebaseWebApiKey: () => {
    //     return process.env.FIREBASE_WEB_API_KEY.trim()
    // },

    firebaseStorageBucket: ()=>{
        return process.env.FIREBASE_STORAGE_BUCKET
    },
    
    firestoreDbRef: () => {
        return process.env.FIRESTORE_DB_REF.trim();
    },
    // jwtSecret: () => {
    //     return process.env.JWT_SECRET;
    // },
    

 


}