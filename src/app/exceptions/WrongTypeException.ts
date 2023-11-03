class WrongTypeException extends Error {
    constructor(){
        super();
        this.message = "The type of the provided input does not match the expected input";
    }
}