import WrongTypeException from "@/app/(admin)/exceptions/WrongTypeException";

export default class Question {
    private _description: string;
    private _mandatory: boolean;
    private _userDisplay: boolean;
    private _questionType: QuestionTypes;
    private _number: number;
    public get number(): number {
        return this._number;
    }
    public set number(value: number) {
        this._number = value;
    }

    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
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

    public get questionType(): QuestionTypes {
        return this._questionType;
    }
    public set questionType(value: QuestionTypes) {
        this._questionType = value;
    }

    constructor(type : QuestionTypes, number: number) {
        this._description = "";
        this._mandatory = true;
        this._userDisplay = false;
        this._questionType = type;
        this._number = number;

    }

    /**
     * If this is a multiple choice question, add an option. Else, do nothing
     */
    public addOption() : void {
        if(this instanceof MultipleChoice){
            (this as MultipleChoice).options.push("Option");
        }
    }

    /**
     * If this is a multiple choice question, rename an option. Else, do nothing
     * @param index Index of option to be renamed
     * @param newName New name to add to option
     */
    public renameOption(index : number, newName : string) : void {
        if(this instanceof MultipleChoice){
            (this as MultipleChoice).options[index] = newName;
        }
    }

    /**
     * If this is a multiple choice question, remove an option. Else, do nothing
     * @param index  Index of option to be removed
     */
    public removeOption(index: number) : void {
        if(this instanceof MultipleChoice) {
            (this as MultipleChoice).options.splice(index, 1);
        }
    }

}

export class MultipleChoice extends Question {
    private _saveRole: boolean;
    private _options : Array<string>;
    private _type : ChoiceTypes;

    //Get and set functions for the fields.
    public get saveRole(): boolean {
        return this._saveRole;
    }
    public set saveRole(value: boolean) {
        this._saveRole = value;
    }

    public get options(): Array<string> {
        return this._options;
    }
    public set options(value: Array<string>) {
        this._options = value;
    }

    public get type(): ChoiceTypes {
        return this._type;
    }
    public set type(value: ChoiceTypes) {
        this._type = value;
    }

    constructor(number: number){
        super(QuestionTypes.multipleChoice, number);
        this._saveRole = false;
        this._options = [];
        this._type = ChoiceTypes.radio;
    }

}

export class Slider extends Question {
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

    constructor(number: number){
        super(QuestionTypes.slider, number);
        this._type = SliderTypes.agreeDisagree;
        this._range = 7;
    }
}

/**
 * The two types for multiple choice questions, radio and checkbox
 */
export enum ChoiceTypes {
    radio, checkbox
}

/**
 * The two types for slider questions, agree/disagree or numerical values
 */
export enum SliderTypes {
    agreeDisagree, values
}

/**
 * The three types of questions, multiple choice, slider and text input
 */
export enum QuestionTypes {
    multipleChoice, slider, textInput
}