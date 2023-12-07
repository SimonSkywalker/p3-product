import test from "node:test";
import NoObjectException from "@/app/(admin)//exceptions/NoObjectException";
import Nameable from "./Nameable";
import { log } from "console";


/**
 * A class that contains an array of nameable objects
 * Objects can be added, removed, and gotten through using their names;
 */
export default class DatabaseAccess {
    private _objects : Array<Nameable>;

    public get objects(){
        return this._objects;
    }

    constructor(array : Array<Nameable>){
        this._objects = array;
    }

    /**
     * Checks if a nameable object already exists in the database
     * @param object The object to be compared
     * @returns True, if another object with the name exist. Otherwise, false
     */
    public checkDuplicate(object : Nameable) : boolean {
        console.log(this._objects);
        return (this._objects.some((testObject) => {
            console.log("Comparing " + testObject.name + " to " + object.name)
            return testObject.name == object.name.trim()}));
    }


    /**
     * Finds an object with a given name in the database
     * @param name The name to search for
     * @returns The index of the first object with the desired name, or an error if it does not exist
     */

    public getIndexFromDatabase(name : string) : number {

        for (let i : number = 0; i < this._objects.length; i++) {
            console.log("comparing " + this._objects[i].name + " to " + name);
            if (this._objects[i].name == name) {
                return i;
            }
        }
        //If the database is looped through with no object.
        throw new NoObjectException;
    }

    /**
     * Pushes a nameable object to the database
     * @param object A nameable object
     */
    public addToDatabase(object : Nameable) : void {
            this._objects.push(object);
    }

    
    /**
     * Removes an object with a given name from the database
     * @param name The name of the object
     * @returns This object's array
     */
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