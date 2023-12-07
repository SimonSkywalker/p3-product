export class TitleDuplicateException extends Error {
    static message: any;
    
    constructor(){
        super();
        this.message = "Project titles must be unique";
    }
    
}