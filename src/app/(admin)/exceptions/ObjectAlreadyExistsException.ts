export default class ObjectAlreadyExistsException extends Error {
    constructor(msg: string) {
        super(msg);
    }

}