import NoObjectException from "../exceptions/NoObjectException";
import WrongTypeException from "../exceptions/WrongTypeException";
import Form from "./form";


export default class DatabaseAccess<T> {
    private _objects : Array<T>;

    public get objects(){
        return this._objects;
    }

    constructor(array : Array<T>){
        this._objects = array;
    }

    public checkDuplicate(object : T) : boolean {
        return (this._objects.some((testObject) => {return testObject == object}));
    }


    //Takes an object array and a string as input.
    //If the array is a Form array, and it has an object with the name, return the object
    //If not, throw an exception.
    public getIndexFromDatabase(name : String) : number {

        for (let i in this._objects) {
            if (this._objects[i] instanceof Form) {
                if ((this._objects[i] as Form).name == name){
                    return parseInt(i);
                }
            }
            else throw new WrongTypeException;
        }
        //If the database is looped through with no object.
        throw new NoObjectException;
    }

    public addToDatabase(object : T) : void {
            this._objects.push(object);
    }


    public removeFromDatabase(name : String) : Array<Form> {
        let i = -1
        //Gets index of object with the desired name
        try {
            i = this.getIndexFromDatabase(name);
        }
        //If the object does not exist, return with no change
        catch (NoObjectException) {
            return this._objects as Array<Form>
        }

        //Removes object at index i
        this._objects.splice(i, 1);
        return this._objects as Array<Form>
    }
}