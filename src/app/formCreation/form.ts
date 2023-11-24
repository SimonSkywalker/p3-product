import Token from "./Token";
import WrongTypeException from "../exceptions/WrongTypeException";
import NoObjectException from "../exceptions/NoObjectException";
import Question, { MultipleChoice, Slider } from "./question";
import { QuestionTypes } from "./question";
import FormValidator from "./FormValidator";
import FileFinder from "./FileFinder";
import Nameable from "./Nameable";


export default class Form implements Nameable {
    private _name: string;
    private _description: string;
    private _questions: Array<Question>;
    private _tokens: Array<Token>;
    private _isActive: boolean;

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    //Get and set functions for the fields.
    public get name(): string {
        return this._name;
    }

    public getName(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
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
        this._isActive = true;
    }

    
    public addQuestion(questionType : QuestionTypes) : void{
        switch (questionType){
            case QuestionTypes.multipleChoice: {
                this.questions.push(new MultipleChoice(this.questions.length+1));
                break;
            }
            case QuestionTypes.slider: {
                this.questions.push(new Slider(this.questions.length+1));
                break;
            }
            default: {
                this.questions.push(new Question(QuestionTypes.textInput, this.questions.length+1));
                break;
            }
        }
    }

    public removeQuestion(index: number) : void{
        this.questions.splice(index, 1);
        for (let i = 0; i < this.questions.length; i++){
            this.questions[i].number = i+1;
        }
    }

    /**
     * Replaces space with dash
     */
    public cleanName() : void{
        this.name = this.name.replace(/ /g, "-");
    }

    public getUncleanName() : string{
        let newName : string = this.name;
        return newName.replace(/-/g," ");
    }
}