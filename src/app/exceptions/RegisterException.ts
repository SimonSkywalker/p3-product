export class RegisterException extends Error {
    
    constructor(){
        super();
        this.message = "Username already exists";
    }
    
}