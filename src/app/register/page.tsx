'use client'
import React from 'react';
import Link from 'next/link';
import { registerFormSchema } from '../lib/validations/registerForm';
import {useState} from 'react';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import { RegisterException } from '../exceptions/RegisterException';
import { error } from 'console';

export default function RegisterPage() {
  

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  }) 

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const [UserError, setUserError] = useState('');
  const [PasswordError, setPasswordError] = useState('');
  const [cPasswordError, setcPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Here zod performs it's magic by parsing your data against
      // the schema defined earlier.
      
      setUserError("");
      setPasswordError("");
      setcPasswordError("");

      //Const Username and password is matched with the fields in the form Schema. 
      const validatedData = registerFormSchema.parse(form)
      
      // We send the validated data to the an API endpoint
      // on the server; we will code this later.
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(validatedData),
      })
        .then((response) => {
          if (response.ok) {
            // Request was successful
            const router = useRouter();
            router.push('/login');
            return response.json().then((data) => {
              console.log(data);
              // Process the response data as needed
               
            });
          } else if(RegisterException){
            
            setUserError('Username already exists')
          }
        })
     
    } catch (err: any) {
      
      
      if (err instanceof ZodError)
      {         
        err.issues.forEach((issue: any) => {
          switch (issue.path[0]) {
            case 'username':
              setUserError(issue.message);
              break;
            case 'password':
              setPasswordError(issue.message);
              break;
            case 'confirmPassword':
              setcPasswordError(issue.message);
              break;
            default:
              console.error(issue.message);
              
          }
        });
      }

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
              onChange={handleChange} 
              name="username"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          <div className="text-red-500 text-sm">{UserError}</div>
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
          onChange={handleChange} 
          name="password"
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
        <div className="text-red-500 text-sm">{PasswordError}</div>
      </div>
        <div className="mb-2">
          <label
            htmlFor="repeatPassword"
            className="block text-sm font-semibold text-gray-800"
            >
            Confirm Password
          </label>
          <input
            type="password" 
            id="repeatPassword" 
            autoComplete='new-password' 
            onChange={handleChange} 
            name="confirmPassword"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        <div className="text-red-500 text-sm">{cPasswordError}</div>
      </div>
      <div 
        className="mt-2">
        <button 
          type="submit"
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



