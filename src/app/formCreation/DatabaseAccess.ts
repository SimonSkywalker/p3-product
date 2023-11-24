import NoObjectException from "../exceptions/NoObjectException";
import WrongTypeException from "../exceptions/WrongTypeException";
import Form from "./form";
import Nameable from "./Nameable";


export default class DatabaseAccess {
    private _objects : Array<Nameable>;

    public get objects(){
        return this._objects;
    }

    constructor(array : Array<Nameable>){
        this._objects = array;
    }

    public checkDuplicate(object : Nameable) : boolean {
        return (this._objects.some((testObject) => {return testObject == object}));
    }


    //Takes an object array and a string as input.
    //If the array is a Form array, and it has an object with the name, return the object
    //If not, throw an exception.
    public getIndexFromDatabase(name : string) : number {

        for (let i : number = 0; i < this._objects.length; i++) {
            
            console.dir(this._objects[i] as Form);
            console.log("comparing " + this._objects[i].getName() + " with " + name);
            if (this._objects[i].getName() == name) {
                return i;
            }
        }
        //If the database is looped through with no object.
        throw new NoObjectException;
    }

    public addToDatabase(object : Nameable) : void {
            this._objects.push(object);
    }


    public removeFromDatabase(name : string) : Array<Nameable> {
        let i = -1
        //Gets index of object with the desired name
        try {
            i = this.getIndexFromDatabase(name);
        }
        //If the object does not exist, return with no change
        catch (NoObjectException) {
            return this._objects as Array<Nameable>
        }

        //Removes object at index i
        this._objects.splice(i, 1);
        return this._objects as Array<Nameable>
    }
}