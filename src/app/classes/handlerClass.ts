import * as z from "zod";
import {registerFormSchema} from '../lib/validations/registerForm';
import { RegisterException } from "../exceptions/RegisterException";
import { LoginException } from "../exceptions/LoginException";
import { loginFormSchema } from "../lib/validations/loginForm";

interface FormData {
  username: string;
  password: string;

}

interface RegFormData extends FormData {
  confirmPassword: string;
}

export class LoginHandler{

  protected _formData: FormData = {
  username: '',
  password: '',
  }

  public get formData() {
    return this._formData;
  }
  public set formData(value) {
    this._formData = value;
  }

  protected _validationErrors: FormData = {
    username: '',
    password: '',
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
  }

  public handleChange(type: string, value: string) {

    this.formData = {
      ...this.formData,
      [type]: value
    }
    
  } 

  
}

export class RegistrationHandler extends LoginHandler{


   protected _formData: RegFormData = {
    ...this._formData,
    confirmPassword: '',
  };
  public get formData(): RegFormData {
    return this._formData;
  }
  public set formData(value: RegFormData) {
    this._formData = value;
  }
    
   protected _validationErrors: RegFormData = {
    ...this._validationErrors,
    confirmPassword: '',
  };
  public get validationErrors(): RegFormData {
    return this._validationErrors;
  }
  public set validationErrors(value: RegFormData) {
    this._validationErrors = value;
  }

  
}


export class ErrorCheck{

  public static errorValidationLogin(Error: any, outputError: FormData){

    LoginHandler.cleanData(outputError)
    
    if(Error instanceof z.ZodError){
      Error.errors.forEach((validationError) => {
        // Extract the field name and error message from the validationError.
        const fieldName = validationError.path[0] as keyof z.infer<typeof loginFormSchema>;
        const errorMessage = validationError.message;

        outputError[fieldName] = errorMessage;
        
      });
      
      
    } 
    return outputError
  }  
  public static errorValidationRegister(Error: any, outputError: RegFormData){

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
  public static async APIRequestLogin(Data:any){
    
    const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(Data),
      })
        
          if (response.ok) { 

            const { token } = await response.json()
            document.cookie = `token=${token}; path=/`;
         
            return response.json()
          } else if(response.status === 409){

            throw new LoginException

          }
         
        
     
  }

}

