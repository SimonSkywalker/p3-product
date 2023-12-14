import Token from "./Token";
import Question, { MultipleChoice, Slider } from "../question";
import { QuestionTypes } from "../question";
import Nameable from "../../interfaces/Nameable";
import _ from "lodash";


/**
 * The class denoting forms created and sent to respondents.
 * It contains the name and description of the form, whether it is active, and arrays for the relevant questions and tokens.
 * The question array can be changed through the addQuestion and removeQuestion functions.
 */
export default class Form implements Nameable {
    private _name: string;
    private _description: string;
    private _questions: Array<Question>;
    private _tokens: Array<Token>;
    private _isActive: boolean;


    //Get and set functions for the fields.
    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }
    public get name(): string {
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

    
    /**
     * Creates a new question object and adds it to the question array
     * @param questionType The subclass of the question to be added
     */
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

    /**
     * Removes a question from the questions array
     * Then, reassigns numbers to each question so they still go from 1 to n
     * @param index The index of the question, which is equal to question.number-1
     */
    public removeQuestion(index: number) : void {
        this.questions.splice(index, 1);
        for (let i = 0; i < this.questions.length; i++){
            this.questions[i].number = i+1;
        }
    }

    /**
     * Replaces spaces in name with dashes
     * Used to make name compatible with the file system
     * Also trims in order to remove spaces
     */
    public cleanName() : void {
        this.name = this.name.trim().replace(/ /g, "-");
    }


    /**
     * Gets the name before it was cleaned. Used to display names with spaces to users.
     * @returns This object's name, dashes being replaced with spaces
     */
    public getUncleanName() : string {
        let newName : string = this.name;
        return newName.replace(/-/g," ");
    }

    /**
     * Creates a new form to be a child of this form.
     * @returns A new, active form with the same questions as this form
     */
    public createChild() : Form {
        const child = _.cloneDeep(this);
        child.name = "Copy-of-" + this.name;
        child.isActive = true;
        child.tokens = [];
        return child;
    }

    /**
     * Compares this form to another form, and returns an array with every question that is an exact match between the two
     * @param otherForm Another form object
     * @returns An array of questions
     */
    public findMatchingQuestions(otherForm : Form) : Array<Question> {
        let matchingQuestions : Array<Question> = new Array<Question>
        for(let i = 0; i < this.questions.length; i++){
            for(let j = 0; j < otherForm.questions.length; j++)
                if(_.isEqual(otherForm.questions[j], this.questions[i])){
                    matchingQuestions.push(this.questions[i]);
                }
        }
        return matchingQuestions;
    }

}