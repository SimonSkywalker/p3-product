import * as z from "zod";
import {registerFormSchema} from '../lib/validations/registerForm';
import { RegisterException } from "../exceptions/RegisterException";
import fetch from "node-fetch";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;

}

export class RegistrationHandler{

  private _formData: FormData = {
  username: '',
  password: '',
  confirmPassword: '',
  }

  public get formData() {
    return this._formData;
  }
  public set formData(value) {
    this._formData = value;
  }

  private _validationErrors: FormData = {
    username: '',
    password: '',
    confirmPassword: '',
    }

  public get validationErrors() {
    return this._validationErrors;
  }
  public set validationErrors(value) {
    this._validationErrors = value;
  }

  public static cleanData(form: FormData){
    form.username  = '';
    form.password = '';
    form.confirmPassword = '';
  }

  public handleChange(type: string, value: string) {

    this.formData = {
      ...this.formData,
      [type]: value
    }
    
  } 

  
}


export class ErrorCheck{

  public static errorValidation(Error: any, outputError: FormData){

    RegistrationHandler.cleanData(outputError)
    
    if(Error instanceof z.ZodError){
      Error.errors.forEach((validationError) => {
        // Extract the field name and error message from the validationError.
        const fieldName = validationError.path[0] as keyof z.infer<typeof registerFormSchema>;
        const errorMessage = validationError.message;

        outputError[fieldName] = errorMessage;
        
      });
      
      
    } 
    return outputError
  }  
}

export class APIHandle{

  public static async APIRequestRegister(Data: any, Errors: any){
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(Data),
    })
      .then((response) => {
        if (response.ok) {
          // Request was successful
          console.log('hej');
          
          return response.json()
        }if(response.status == 409){
         
          throw new RegisterException
            
        }
        
      })
        
     
  }

}