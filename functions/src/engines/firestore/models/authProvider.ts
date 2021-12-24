export interface AuthProvider {
    id?: string;
    uid: string;
    
    /** provider user id */
    providerUserId: string;

    
    /** credential */ 
    credential?: string;
    
    /** provider */ 
    provider: string;
   
    /** identifier */
    identifier?: string;
   
    /** authType */
    authType?: number;
   
    /** status */
    status: number;
}

