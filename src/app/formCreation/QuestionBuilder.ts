import Question, { ChoiceTypes, MultipleChoice, QuestionTypes, Slider, SliderTypes } from "./question";

export default class QuestionBuilder{
    private _question : Question;



    public constructor (questionType : QuestionTypes){
        switch (questionType){
            case QuestionTypes.multipleChoice: {
                this._question = new MultipleChoice(0);
                break;
            }
            case QuestionTypes.slider: {
                this._question = new Slider(0);
                break;
            }
            default: {
                this._question = new Question(QuestionTypes.textInput, 0);
                break;
            }
        }
    }
    



    public questionFromObject(object : any) : Question {
            this._question.description = object._description;
            this._question.mandatory = object._mandatory;
            this._question.userDisplay = object._userDisplay;
            this._question.number = object._number;
            this._question.questionType = object._questionType;
            if (this._question.questionType == QuestionTypes.multipleChoice){
                (this._question as MultipleChoice).saveRole = object._saveRole;
                (this._question as MultipleChoice).choiceType = object._choiceType;
                (this._question as MultipleChoice).options = object._options;
            } else if (this._question.questionType == QuestionTypes.slider){
                (this._question as Slider).range = object._range;
                (this._question as Slider).sliderType = object._sliderType;
            }

        return this._question;
    }

}