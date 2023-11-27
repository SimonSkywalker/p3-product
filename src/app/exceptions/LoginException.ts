export class LoginException extends Error {
    static message: any;
    
    constructor(){
        super();
        this.message = "Wrong credentials, try again.";
    }
    
}

