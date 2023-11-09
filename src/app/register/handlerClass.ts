import * as z from "zod";
import {registerFormSchema} from '../lib/validations/registerForm';
import { RegisterException } from "../exceptions/RegisterException";
import { useRouter } from 'next/navigation';


interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
}


class RegistrationHandler extends FormData {
  

  private formData: FormData = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  private validationErrors: Record<string, string> = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  public handleChange(name: string, value: string) {
    this.formData = {
      ...this.formData,
      [name]: value,
    };
  }

  public async handleSubmit(): Promise<void> {
    try {
      this.validationErrors = {
        username: '',
        password: '',
        confirmPassword: '',
      };

      // Perform API request and other logic
      APIHandle.APIRequestRegister(registerFormSchema.parse(this.formData), this.validationErrors)
     

    } catch (err) {
      ErrorCheck.errorValidation(err, this.validationErrors);
      console.error(err);
    }
  }
}

export default RegistrationHandler;

class ErrorCheck{

public static errorValidation(err: any, validationErrors: any){
  if (err instanceof z.ZodError) {
    validationErrors = {};

    err.errors.forEach((validationError) => {
      const fieldName = validationError.path[0];
      const errorMessage = validationError.message;
      validationErrors[fieldName] = errorMessage;
    });
  } else if (err instanceof RegisterException) {
    validationErrors = {
      ...validationErrors,
      username: err.message,
    };
  }
} 


}


class APIHandle{

  public static async APIRequestRegister(Data: any, Errors: any){
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(Data),
    })
      .then((response) => {
        if (response.ok) {
          // Request was successful
          const router = useRouter();
          router.push('/login');
          return response.json().then((data) => {
            console.log(data);
             
          });
        } else if(RegisterException){

          let a = new RegisterException;
          Errors = {
            ...Errors,
            username: a.message,
          };
        }
      })
  }

}