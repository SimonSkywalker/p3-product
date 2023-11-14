import * as z from "zod";
import {registerFormSchema} from '../lib/validations/registerForm';
import { RegisterException } from "../exceptions/RegisterException";
import { useRouter } from 'next/navigation';
import { useState } from "react";

interface ObjectInterface {
    _username: string;
    _password: string;
    _confirmPassword: string;
}

export class FormData implements ObjectInterface {
    _username: string;
    _password: string;
    _confirmPassword: string;

    constructor(username: string, password: string, confirmPassword: string) {
        this._username = username;
        this._password = password;
        this._confirmPassword = confirmPassword;
    }

    // Getter methods
  get getUsername(): string {
    return this._username;
  }

  get getPassword(): string {
    return this._password;
  }

  get getConfirmPassword(): string {
    return this._confirmPassword;
  }

  // Setter methods
  set setUsername(username: string) {
    this._username = username;
  }

  set setPassword(password: string) {
    this._password = password;
  }

  set setConfirmPassword(confirmPassword: string) {
    this._confirmPassword = confirmPassword;
  }

  private useFormData = () => {
    const [state, setState] = useState({
      username: '',
      password: '',
      confirmPassword: '',
    });
  
    const handleChange = (e: any) => {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    };
  
    return { state, handleChange };
  };
      
}

