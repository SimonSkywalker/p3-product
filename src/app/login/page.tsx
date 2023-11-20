"use client"

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { loginFormSchema } from '../lib/validations/loginForm';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { LoginException } from '../exceptions/LoginException';
import {APIHandle, ErrorCheck, LoginHandler} from '../classes/handlerClass';



export default function LoginPage() {
  //const router = useRouter();
  
  //Constants used to handle data
  const loginHandler = new LoginHandler();
  const [formData, setFormData] = useState(loginHandler.formData);
  const [validationErrors, setValidationErrors] = useState(loginHandler.validationErrors);
   
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

    //Updates formData in the class with the values of the fields
    loginHandler.handleChange('username', formData.username);
    loginHandler.handleChange('password', formData.password);


    try{

      //Clears ValidationErrors data
      setValidationErrors(loginHandler.validationErrors);
      LoginHandler.cleanData(loginHandler.validationErrors);

      //Validates data up against the LoginSchema
      const validatedData = loginFormSchema.parse(loginHandler.formData);

      //Sends the data to server validation and handling
      APIHandle.APIRequestLogin(validatedData)
      .then(()=>{/* router.push('/leaderHome') */})
      .catch((err)=>{
        //Is true if the wrong credentials are inputted
        if (err instanceof LoginException) {setValidationErrors({...validationErrors, password:  err.message, username: ''})}
      });

      
    
    } catch (err: any) {
        
        if (err instanceof z.ZodError) {
        // Handle validation errors
        setValidationErrors(ErrorCheck.errorValidationLogin(err, loginHandler.validationErrors));

      }
  }
}

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div 
        className="w-full p-6 rounded-md shadow-md lg:max-w-xl bg-white-300 shadow-2xl">
        <h1 
          className="text-3xl font-bold text-center text-gray-700">
          Login
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
              Username
            </label>
            <input
              type="text" 
              id="username" 
              autoComplete="username" 
              onChange={handleInput} 
              name='username'
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {validationErrors.username && (
              <div 
                className="error">
                {validationErrors.username}
              </div>
            )}
          </div>
          <div 
            className="mb-2">
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password" 
              id="password" 
              autoComplete="current-password" 
              onChange={handleInput} 
              name='password'
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {validationErrors.password && (
              <div 
                className="error">
                {validationErrors.password}
              </div>
            )}
          </div>
          <div className="mt-2">
            <button 
              type="submit" 
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" 
              title="submitButton">
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-palette-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
