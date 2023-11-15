'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { registerFormSchema } from '../lib/validations/registerForm';
import { useRouter } from 'next/navigation';
import { RegisterException } from '../exceptions/RegisterException';
import {APIHandle, ErrorCheck, RegistrationHandler} from '../classes/handlerClass';


export default function RegisterPage() {
  const router = useRouter();
  const registrationHandler = new RegistrationHandler();
  const [formData, setFormData] = useState(registrationHandler.formData);
  const [validationErrors, setValidationErrors] = useState(registrationHandler.validationErrors);
   
 const handleInput = (e: React.ChangeEvent<HTMLInputElement> )=>{
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    registrationHandler.handleChange('username', formData.username);
    registrationHandler.handleChange('password', formData.password);
    registrationHandler.handleChange('confirmPassword', formData.confirmPassword);    
    
    try{
      setValidationErrors(registrationHandler.validationErrors);
      RegistrationHandler.cleanData(registrationHandler.validationErrors)
      const validatedData = registerFormSchema.parse(registrationHandler.formData);   
      APIHandle.APIRequestRegister(validatedData,registrationHandler.validationErrors)
      .then(()=>{router.push('/login')})
      .catch((err)=>{
        if (err instanceof RegisterException) {setValidationErrors({...validationErrors, username: err.message, confirmPassword: ''})}
      }) 
    }catch(Error){
      setValidationErrors(ErrorCheck.errorValidationRegister(Error, registrationHandler.validationErrors));
    }
  }
  return (
  <div 
  className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
  <div 
    className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
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
                className="text-red-500 text-sm">
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
              className="text-red-500 text-sm">
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
              className="text-red-500 text-sm">
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
          className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
  </div>
</div>
);
}



