"use client"

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { ZodError } from 'zod';
import { loginFormSchema } from '../lib/validations/loginForm';

export default function loginPage() {


  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  const [UserError, setUserError] = useState('');
  const [PasswordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    //Const Username and password is matched with the fields in the form Schema. 
    try {
      const validatedData = loginFormSchema.parse({ username:Username, password:Password })
      // We send the validated data to the an API endpoint
      // on the server; we will code this later.

       await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(validatedData),
      })
        .then((response) => {
          if (response.status === 500) {
            // Handle the 500 Internal Server Error
            setUserError("Username is already taken");
            // You can display an error message to the user or take other actions
          } else if (response.status === 409) {
            // Handle the 409 conflict error
            return response.json().then((data) => {
              console.error('Conflict error:', data);
              // Handle the conflict error, e.g., display an error message to the user
            });
          } else if (response.ok) {
            // Request was successful
            //router.push('/login');
            return response.json().then((data) => {
              console.log(data);
              // Process the response data as needed
              
            });
          } else {
            // Handle other errors (status codes other than 409 and 500)
            console.error('Other error:', response.status, response.statusText);
            // Handle other errors as needed
          }
        })
    
    } catch (err: any) {
      let error = err
      if (err instanceof ZodError) {         
        error.issues.forEach((issue: any) => {
          switch (issue.path[0]) {
            case 'username':
              setUserError(issue.message);
              break;
            case 'password':
              setPasswordError(issue.message);
              break;
            default:
              // Handle any other fields or issues
          }
        });
      }

      console.log(err)
      

      }
  }
  

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-700">Login</h1>
        <p></p>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
              Username
            </label>
            <input
              type="text" id="username" autoComplete="username" onChange={(e) => setUsername(e.target.value)} value={Username}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            <div className="text-red-500 text-sm">{UserError}</div>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password" id="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} value={Password}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            <div className="text-red-500 text-sm">{PasswordError}</div>
          </div>
          <div className="mt-2">
            <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
