import * as z from "zod";
import { loginFormSchema } from "../lib/validations/loginForm";
import { LoginException } from "../exceptions/LoginException";


interface FormData {
  username: string;
  password: string;
}

export class RegistrationHandler{

  private _formData: FormData = {
  username: '',
  password: '',
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


export class ErrorCheck{

  public static errorValidation(Error: any, outputError: FormData){

    RegistrationHandler.cleanData(outputError)
    
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
}

export class APIHandle{

  public static async APIRequestRegister(Data:any){
    
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