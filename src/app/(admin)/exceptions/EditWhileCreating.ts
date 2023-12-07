export class EditWhileCreating extends Error {
    static message: any;
    
    constructor(){
        super();
        this.message = `Please finish creating before editing`;
    }
    
}