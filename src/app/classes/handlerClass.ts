import * as z from "zod";
import {registerFormSchema} from '../lib/validations/registerForm';
import { RegisterException } from "../exceptions/RegisterException";
import { LoginException } from "../exceptions/LoginException";
import { loginFormSchema } from "../lib/validations/loginForm";

//Used for login
interface FormData {
  username: string;
  password: string;

}

//Used for registration
interface RegFormData extends FormData {
  confirmPassword: string;
}

/**
 * Proctected instance fields is 'protected' to allow other classes
 * within the file to access the fields 
 */
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

  /**
   * Used to clear Validation Errors data
   */
  public static cleanData(form: FormData){
    form.username  = '';
    form.password = '';
  }

  /**
   * Updates the formData fields based of the input
   */
  public handleChange(type: string, value: string) {
    this.formData = {
      ...this.formData,
      [type]: value
    }
  } 
}

/**
 * Proctected instance fields is 'protected' to allow other classes
 * within the file to access the fields 
 */
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

/**
 * Error class for error handling validation (zod)
 */
export class ErrorCheck{

  /**
   * Login Validation Error handling
   */
  public static errorValidationLogin(Error: any, outputError: FormData){
    
    //Cleans the validation data
    LoginHandler.cleanData(outputError);
    
    //True if validation error occurs
    if(Error instanceof z.ZodError){

      //loops through all validation fields
      Error.errors.forEach((validationError) => {

        // Extract the field name and error message from the validationError.
        const fieldName = validationError.path[0] as keyof z.infer<typeof loginFormSchema>;
        const errorMessage = validationError.message;

        outputError[fieldName] = errorMessage;  
      });
    } 
    return outputError;
  }  

  /**
   * Register Validation Error handling
   */
  public static errorValidationRegister(Error: any, outputError: RegFormData){

    //Cleans the validation data
    RegistrationHandler.cleanData(outputError);
    
    //True if validation error occurs
    if(Error instanceof z.ZodError){

      //loops through all validation fields
      Error.errors.forEach((validationError) => {
        // Extract the field name and error message from the validationError.
        const fieldName = validationError.path[0] as keyof z.infer<typeof registerFormSchema>;
        const errorMessage = validationError.message;

        outputError[fieldName] = errorMessage;
        
      });
    } 
    return outputError;
  }
}

/**
 * Funciton consisting of Fetch calls to the server
 * when writing or checking users in database
 */
export class APIHandle{

  /**
   * Server validates user inputs and checks
   * whether the username is already in use
   */
  public static async APIRequestRegister(Data: any){
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(Data),
    })
      .then((response) => {
        if (response.ok) {
          //Request was successful
          return response.json();
        }if(response.status == 409){
         
          //RegisterException if username already exsit
          throw new RegisterException;   
        }
      })
  }

  /**
   * Server validates user inputs and checks
   * whether the user exist with the correct 
   * credentials given
   */
  public static async APIRequestLogin(Data:any){
    
    /**
      * Server validates user inputs and checks
      * whether the user exist and the given 
      * password is correct
      */
    const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(Data),
      })
        
          if (response.ok) { 

            //assigns the signed token and inserts it in the document
            const { token } = await response.json()
            document.cookie = `token=${token}; path=/`;

            return { success: true };
          } else if(response.status === 409){

            //Throws wrong credetials error 
            throw new LoginException

          }
  }

  /**
   * APIRequestUser
   */
  public static async APIRequestUser() {
    let data;
    try{
    const res = await fetch("/api/getuser") 
      if(res.ok){
      
        data = await res.json();
        //console.log(data);
        return data;
      }
    
    }catch(Error){
        console.error(Error)
    }
  }
}

