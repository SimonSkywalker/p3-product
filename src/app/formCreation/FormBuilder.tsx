import Token from "./Token";
import Form from "./form";
import Question from "./question";
import TokenBuilder from "./TokenBuilder";
import QuestionBuilder from "./QuestionBuilder";
import WrongTypeException from "../exceptions/WrongTypeException";

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


    /**
     * Takes any object, and if it has the same fields as a Form, return a new Form object
     * @param object An object that is known to have the same fields as Form
     * @returns A new Form object with the same values as the initial object
     */
    public formFromObject(object : any) : Form {
        try{
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
        catch (e: any){
            throw new WrongTypeException();
        }
    }
}