
class Form {
    private _name: String;
    private _description: String;
    private _questions: Array<Question>;
    private _exceptedLinks: Array<String>;

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

    public get exceptedLinks(): Array<String> {
        return this._exceptedLinks;
    }
    public set exceptedLinks(value: Array<String>) {
        this._exceptedLinks = value;
    }

    constructor(){
        this._name = "Untitled form";
        this._description = "";
        this._questions = [];
        this._exceptedLinks = [];
    }


    //Takes as input a number and length
    //Outputs an array of random n-length strings with those numbers
    public static createIDStrings(amount:number, length:number) : Array<String> {
        let urls = new Array<String>;
        const characters : String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < amount ; i++) {
            let newURL : String = "";
            for(let j = 0; j < length; i++){
                newURL += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            urls.push(newURL);
        }
        return urls;
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

console.log(Form.createIDStrings(5,7));