export default class NoObjectException extends Error {
    constructor(){
        super();
        this.message = "Negative numbers are not allowed";
    }
}