import { z } from "zod";
import FormValidator from "./FormValidator";

export default class FormErrorHandler {

    private _formData: FormFormData = {
        _name: "",
        _description: "",
        _questions : [{
            _description: "",
            _options: [""],
        }]
    }

    public get formData() {
        return this._formData;
      }
      public set formData(value) {
        this._formData = value;
      }
    
      private _validationErrors: FormFormData = {
        _name: "",
        _description: "",
        _questions : [{
            _description: "",
            _options: [],
        }]
        }
    
        /**
         * Makes sure that there are at least a certain amount of empty questions in the errors data
         * @param questions The number of questions that should (at least) exist
         * @returns This object's validation errors
         */
      public addQuestionErrors(questions : number) : FormFormData 
      {
        while(this._validationErrors._questions.length < questions){
          this._validationErrors._questions.push({_description: "", _options: []});
        }
        return this._validationErrors
      }

      /**
       * Makes sure that a certain question has at least a certain amount of empty option errors
       * @param question Index of the question
       * @param options Number of options that should (at least) exist
       * @returns This object's validation errors
       */
      public addOptionErrors(question : number, options : number) : FormFormData {
        while(this._validationErrors._questions[question]._options.length < options){
          this._validationErrors._questions[question]._options.push("");
        }
        return this._validationErrors;
      }

      public get validationErrors() {
        return this._validationErrors;
      }
      public set validationErrors(value) {
        this._validationErrors = value;
      }

      /**
       * Sets every validation error to be an empty string 
       */
      public cleanErrors() : void {
        this._validationErrors._description = "";
        this._validationErrors._name = "";
        for(let i = 0; i < this._validationErrors._questions.length; i++){
          this.cleanQuestion(i);
        }
      }

      /**
       * Removes all errors form a question
       * @param questionNumber The index of the question
       */
      public cleanQuestion(questionNumber : number) : void {
        this._validationErrors._questions[questionNumber] = {_description: "", _options: []};
      }

      /**
       * Removes the error from an option
       * @param questionNumber The index of the question containing the option
       * @param optionNumber The index of the option
       */
      public cleanOption(questionNumber : number, optionNumber : number) : void {
        this._validationErrors._questions[questionNumber]._options[optionNumber] = "";
      }

      public errorValidation(Error: any) : FormFormData {
        
        //True if validation error occurs
        if(Error instanceof z.ZodError){
    
          //loops through all validation fields
          Error.errors.forEach((validationError) => {
    
            // Extract the field name and error message from the validationError.
            const fieldName : string = validationError.path[0] as keyof z.infer<typeof FormValidator.FormTemplate>;
            const errorMessage = validationError.message;
            if (fieldName == "_questions"){
                const questionNumber : number = parseInt(validationError.path[1] as keyof z.infer<typeof FormValidator.FormTemplate>);
                const questionField : string = validationError.path[2] as keyof z.infer<typeof FormValidator.FormTemplate>;
                if (questionField == "_options"){
                    const optionNumber : number = parseInt(validationError.path[3] as keyof z.infer<typeof FormValidator.FormTemplate>);
                    this._validationErrors._questions[questionNumber]._options[optionNumber] = errorMessage;
                } else {
                    this._validationErrors._questions[questionNumber]._description = errorMessage;
                }
            } else if (fieldName == "_name") {
                this._validationErrors._name = errorMessage;
            } else if (fieldName == "_description") {
                this._validationErrors._description = errorMessage;
            }
          });
        } 
        return this._validationErrors;
      }  



}

export interface FormFormData {
    _name: string;
    _description: string;
    _questions : Array<{
        _description: string;
        _options: Array<string>;
    }>

}