export default class NoFileNameException extends Error {
    constructor(){
        super();
        this.message = "No file of the name was found";
    }
}