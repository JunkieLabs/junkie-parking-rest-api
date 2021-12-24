import { firestore } from "firebase-admin"


export class FirestoreUtil {

    static converter = <T>() => ({
        toFirestore: (data: T) => data,
        fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
          snap.data() as T
      })
}

