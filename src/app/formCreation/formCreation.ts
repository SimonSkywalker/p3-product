import Link from "next/link";
import formList from "@/app/database/forms.json"

const fs = require('fs');


class Token {
    private _tokenID: String;
    private _isUsed: boolean;

    public get tokenID(): String {
        return this._tokenID;
    }
    public set tokenID(value: String) {
        this._tokenID = value;
    }

    public get isUsed(): boolean {
        return this._isUsed;
    }
    public set isUsed(value: boolean) {
        this._isUsed = value;
    }

    constructor(ID : String){
        this._tokenID = ID;
        this._isUsed = false;
    }

    //This function takes as input two numbers, amount and length
    //It returns as 
    public static createTokenArray(amount:number, length:number) : Array<Token> {
        let tokens = new Array<Token>;

        const characters : String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < amount ; i++) {
            let randomString : String = "";
            for(let j = 0; j < length; j++){
                randomString += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            let newToken : Token = new Token(randomString);
            tokens.push(newToken);
        }
        return tokens;
    }



}

class Form {
    private _name: String;
    private _description: String;
    private _questions: Array<Question>;
    private _expectedLinks: Array<Token>;

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

    public get expectedLinks(): Array<Token> {
        return this._expectedLinks;
    }
    public set expectedLinks(value: Array<Token>) {
        this._expectedLinks = value;
    }

    constructor(){
        this._name = "Untitled form";
        this._description = "";
        this._questions = [];
        this._expectedLinks = [];
    }

    public uploadToFile(fileName : String) : void {
        fs.writeFile(fileName, JSON.stringify(this))
    }

    public getFromDatabase(database : Array<object>, formName : String) : Form {

        for (let i of database) {
            if (i instanceof Form && (i as Form).name == formName) {
                return i;
            }
        }

        throw ()

    }

}


class Question {
    private _description: String;
    private _mandatory: boolean;
    private _userDisplay: boolean;

    public get description(): String {
        return this._description;
    }
    public set description(value: String) {
        this._description = value;
    }

    public get mandatory(): boolean {
        return this._mandatory;
    }
    public set mandatory(value: boolean) {
        this._mandatory = value;
    }

    public get userDisplay(): boolean {
        return this._userDisplay;
    }
    public set userDisplay(value: boolean) {
        this._userDisplay = value;
    }

    constructor(){
        this._description = "";
        this._mandatory = false;
        this._userDisplay = false;

    }

}

class MultipleChoice extends Question {
    private _saveRole: boolean;
    private _options : Array<String>;
    private _type : ChoiceTypes;

    //Get and set functions for the fields.
    public get saveRole(): boolean {
        return this._saveRole;
    }
    public set saveRole(value: boolean) {
        this._saveRole = value;
    }

    public get options(): Array<String> {
        return this._options;
    }
    public set options(value: Array<String>) {
        this._options = value;
    }

    public get type(): ChoiceTypes {
        return this._type;
    }
    public set type(value: ChoiceTypes) {
        this._type = value;
    }

    constructor(){
        super();
        this._saveRole = false;
        this._options = [];
        this._type = ChoiceTypes.radio;
    }
}

class Slider extends Question {
    private _type: SliderTypes;
    private _range: number;

    public get type(): SliderTypes {
        return this._type;
    }
    public set type(value: SliderTypes) {
        this._type = value;
    }

    public get range(): number {
        return this._range;
    }
    public set range(value: number) {
        this._range = value;
    }

    constructor(){
        super()
        this._type = SliderTypes.agreeDisagree;
        this._range = 7;
    }


}


enum ChoiceTypes {
    radio, checkbox
}

enum SliderTypes {
    agreeDisagree, values
}


export default Token;