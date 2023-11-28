export class EditingAlreadyActive extends Error {
    static message: any;
    
    constructor(projectTitle:string){
        super();
        this.message = `Please finish editing Project: ${projectTitle}`;
    }
    
}