export class CreateWhileEdit extends Error {
    static message: any;
    
    constructor(){
        super();
        this.message = "Please finish editing before creating";
    }
    
}