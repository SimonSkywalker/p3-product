'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { registerFormSchema } from '../lib/validations/registerForm';
import { useRouter } from 'next/navigation';
import { RegisterException } from '../exceptions/RegisterException';
import {APIHandle, ErrorCheck, RegistrationHandler} from '../classes/handlerClass';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * This page component renders a Registration form for users and
 * also validates given input, based on defitions given with zod.
 * If the input is validated, it is then written in the database.
 * @returns The Markup of the Website incl. The Form for registration, various input fields
 */
export default function RegisterPage() {
  //const router = useRouter();
  //Creating the object to handle the data given from input
  const registrationHandler = new RegistrationHandler();

  //States defined to live update data and text.
  const [formData, setFormData] = useState(registrationHandler.formData);
  const [validationErrors, setValidationErrors] = useState(registrationHandler.validationErrors);

  /**
   * Function to update data when a change happens in the input fields 
   * @param e To get the specific element that change happens in
   */ 
  const handleInput = (e: React.ChangeEvent<HTMLInputElement> )=>{
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
  };
  
  /**
   * Function called when the form is submitted
   * @param e To access deafault behaviour 
   */
  const handleSubmit = async (e: React.FormEvent) => {
    //Prevent behaviour of routing to a new page or the same page.
    e.preventDefault();
    //Updates the objects data with updated data from the change event.
    registrationHandler.handleChange('username', formData.username);
    registrationHandler.handleChange('password', formData.password);
    registrationHandler.handleChange('confirmPassword', formData.confirmPassword);    
    
    try{
      //Clears ValidationErrors data
      setValidationErrors(registrationHandler.validationErrors);
      RegistrationHandler.cleanData(registrationHandler.validationErrors);

      //Validates data up against the RegisterSchema
      const validatedData = registerFormSchema.parse(registrationHandler.formData);

      //Sents data to server for second validation & possible database input
      APIHandle.APIRequestRegister(validatedData)
      .then(()=>{
        //routes to login page if input if data is validated without problem
        toast.success('Registered '+formData.username)
        /* router.push('/login') */})
      .catch((err)=>{
        if (err instanceof RegisterException) {
          
          setValidationErrors({...validationErrors, username: err.message, confirmPassword: ''});
        };
      }); 

    }catch(Error){

      toast.error('Registration failed, try again')
      //If Error occurs, this will updates the red error text
      setValidationErrors(ErrorCheck.errorValidationRegister(Error, registrationHandler.validationErrors));
    };
  };
  return (
  <div 
  className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
  <ToastContainer />
  <div 
    className="w-full p-6 rounded-md shadow-md lg:max-w-xl bg-white-300">
    <h1 className="text-3xl font-bold text-center text-gray-700">Register</h1>
    <form 
      className="mt-6" 
      onSubmit={handleSubmit}>
        <div 
          className="mb-4">
            <label 
              htmlFor="username" 
              className="block text-sm font-semibold text-gray-800">
              Username
            </label>
            <input
              type="text" 
              id="username" 
              autoComplete="username" 
              onChange={handleInput} 
              name="username"
              data-testid="unInput"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {validationErrors.username && (
              <div 
                className="error">
                {validationErrors.username}
              </div>
            )}
        </div> 
      <div className="mb-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-semibold text-gray-800">
          Password
        </label>
        <input
          type="password" 
          id="password" 
          autoComplete="new-password" 
          onChange={handleInput} 
          name="password"
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
          {validationErrors.password && (
            <div 
              className="error">
              {validationErrors.password}
            </div>
          )}
      </div> 
        <div className="mb-2">
          <label
            htmlFor="repeatPassword"
            className="block text-sm font-semibold text-gray-800">
            Confirm Password
          </label>
          <input
            type="password" 
            id="repeatPassword" 
            autoComplete='new-password' 
            onChange={handleInput} 
            name="confirmPassword"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
          {validationErrors.confirmPassword && (
            <div 
              className="error">
              {validationErrors.confirmPassword}
            </div>
          )}
        </div>
      <div 
        className="mt-2">
        <button 
          type="submit"
          title="submitButton"
          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" >
          Register
        </button>
      </div>
    </form>
      <p 
        className="mt-4 text-sm text-center text-gray-700">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-palette-500 hover:underline">
          Log in
        </Link>
      </p>
  </div>
</div>
);
}