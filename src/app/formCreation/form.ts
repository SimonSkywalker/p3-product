import Token from "./formCreation";
import WrongTypeException from "../exceptions/WrongTypeException";
import NoObjectException from "../exceptions/NoObjectException";
import Question from "./question";
import { QuestionTypes } from "./question";


export default class Form {
    private _name: String;
    private _description: String;
    private _questions: Array<Question>;
    private _tokens: Array<Token>;

    //Get and set functions for the fields.
    public get name(): String {
        return this._name;
    }
    public set name(value: String) {
        this._name = value;
    }

    public get description(): String {
        return this._description;
    }
    public set description(value: String) {
        this._description = value;
    }

    public get questions(): Array<Question> {
        return this._questions;
    }
    public set questions(value: Array<Question>) {
        this._questions = value;
    }

    public get tokens(): Array<Token> {
        return this._tokens;
    }
    public set tokens(value: Array<Token>) {
        this._tokens = value;
    }

    public constructor(){
        this._name = "Untitled form";
        this._description = "";
        this._questions = [];
        this._tokens = [];
    }

    
    public addQuestion(questionType : QuestionTypes) : void{
        this.questions.push (new Question(questionType))
    }


    public checkDuplicate(database : Array<Object>) : boolean {
        return (database.some((form) => {return form == this}));
    }


    //Takes an object array and a string as input.
    //If the array is a Form array, and it has an object with the name, return the object
    //If not, throw an exception.
    public static getIndexFromDatabase(database : Array<Object>, name : String) : number {

        for (let i in database) {
            if (database[i] instanceof Form) {
                if ((database[i] as Form).name == name){
                    return parseInt(i);
                }
            }
            else throw new WrongTypeException;
        }
        //If the database is looped through with no object.
        throw new NoObjectException;
    }

    public addToDatabase(database : Array<Object>) : void {
        database.push(this);
    }

    //Takes as input a Form database
    //Finds a Form with the given name
    //Returns the database without this form
    //Have to catch WrongTypeException
    public static removeFromDatabase(database : Array<Object>, name : String) : Array<Form> {
        let i = -1
        //Gets index of object with the desired name
        try {
            i = Form.getIndexFromDatabase(database, name);
        }
        //If the object does not exist, return with no change
        catch (NoObjectException) {
            return database as Array<Form>
        }

        //Removes object at index i
        database.splice(i, 1);
        return database as Array<Form>
    }

}