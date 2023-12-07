export class RegisterException extends Error {
    static message: any;
    
    constructor(){
        super();
        this.message = "Username already exists";
    }
    
}

