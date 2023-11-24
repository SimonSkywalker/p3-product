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
    
      public get validationErrors() {
        return this._validationErrors;
      }
      public set validationErrors(value) {
        this._validationErrors = value;
      }

      public static errorValidationLogin(Error: any, outputError: FormFormData){
        
        //True if validation error occurs
        if(Error instanceof z.ZodError){
    
          //loops through all validation fields
          Error.errors.forEach((validationError) => {
    
            // Extract the field name and error message from the validationError.
            const fieldName = validationError.path[0] as keyof z.infer<typeof FormValidator.FormTemplate>;
            const errorMessage = validationError.message;
    
            outputError[fieldName] = errorMessage;  
          });
        } 
        return outputError;
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