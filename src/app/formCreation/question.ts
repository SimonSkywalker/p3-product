export default class Question {
    private _description: String;
    private _mandatory: boolean;
    private _userDisplay: boolean;
    private _questionType: QuestionTypes;

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

    public get questionType(): QuestionTypes {
        return this._questionType;
    }
    public set questionType(value: QuestionTypes) {
        this._questionType = value;
    }

    constructor(type : QuestionTypes){
        this._description = "";
        this._mandatory = false;
        this._userDisplay = false;
        this._questionType = type;

    }

}

class MultipleChoice extends Question {
    private _saveRole: boolean;
    private _options : Array<String>;
    private _choiceType : ChoiceTypes;

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

    public get choiceType(): ChoiceTypes {
        return this._choiceType;
    }
    public set choiceCype(value: ChoiceTypes) {
        this._choiceType = value;
    }

    constructor(){
        super(QuestionTypes.slider);
        this._saveRole = false;
        this._options = [];
        this._choiceType = ChoiceTypes.radio;
    }
}

class Slider extends Question {
    private _sliderType: SliderTypes;
    private _range: number;

    public get sliderType(): SliderTypes {
        return this._sliderType;
    }
    public set sliderType(value: SliderTypes) {
        this._sliderType = value;
    }

    public get range(): number {
        return this._range;
    }
    public set range(value: number) {
        this._range = value;
    }

    constructor(){
        super(QuestionTypes.slider);
        this._sliderType = SliderTypes.agreeDisagree;
        this._range = 7;
    }

    public rangeValidator() : boolean {
        if (this.range % 2 == 0 && this.sliderType == SliderTypes.agreeDisagree)
            throw new Error("Range should be an odd number");
        else if (this.range < 1 || this.range > 10)
            throw new Error("range should be between 1 and 10");
        return true;
    }


}


enum ChoiceTypes {
    radio, checkbox
}

enum SliderTypes {
    agreeDisagree, values
}

export enum QuestionTypes {
    multipleChoice, slider, textInput
}