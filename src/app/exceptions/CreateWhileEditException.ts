export class CreateWhileEdit extends Error {
    static message: any;
    
    constructor(projectTitle:string){
        super();
        this.message = `Finish editing Project: ${projectTitle} before creating a new one.`;
    }
    
}