export default class NoObjectException extends Error {
    constructor(){
        super();
        this.message = "No object was found matching the criteia";
    }
}