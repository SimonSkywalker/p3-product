import Token from "./Token";
import Form from "./Form";
import Question from "./question";
import TokenBuilder from "./TokenBuilder";
import QuestionBuilder from "./QuestionBuilder";
import WrongTypeException from "@/app/(admin)/exceptions/WrongTypeException";

/**
 * This class follows the builder design pattern
 * It is used to build a form by gradually adding the components,
 * or by using data from an object outside the form class
 */
export default class FormBuilder {
    private form : Form = new Form();

    public addName(name : string) : FormBuilder {
        this.form.name = name;
        return this;
    }

    public addDescription(desc : string) : FormBuilder {
        this.form.description = desc;
        return this;
    }

    public addActiveStatus(status : boolean) : FormBuilder {
        this.form.isActive = status;   
        return this;
    }

    public addQuestion(question : Question) : FormBuilder {
        this.form.questions.push(question);
        return this;
    }

    public addTokens(tokens : Token[]) : FormBuilder {
        this.form.tokens = tokens;
        return this;
    }


    public getForm() : Form {
        return this.form;
    }
    /*public getFormArray{ 

    }*/


    /**
     * Takes any object, and if it has the same fields as a Form, return a new Form object
     * @param object An object that is known to have the same fields as Form
     * @returns A new Form object with the same values as the initial object, or an exception if the values cannot be copied
     */
    public formFromObject(object : any) : Form {
        if(object._name == undefined || object._description == undefined || object._isActive == undefined || object._questions == undefined || object._tokens == undefined)
            throw new WrongTypeException;
        this.addName(object._name).addDescription(object._description).addActiveStatus(object._isActive);
        this.addTokens((new TokenBuilder).TokenFromObjects(object._tokens));
        for(let i = 0; i < object._questions.length; i++){
            let questionBuilder : QuestionBuilder = new QuestionBuilder(object._questions[i]._questionType);
            this.addQuestion(questionBuilder.questionFromObject(object._questions[i]));   
        }
        for (let i = 0; i < this.form.questions.length; i++){
            this.form.questions[i].number = i+1;
        }
        return this.getForm();
    }
}