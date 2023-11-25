export class EditingAlreadyActive extends Error {
    static message: any;
    
    constructor(){
        super();
        this.message = "Please finish editing before starting another edit";
    }
    
}