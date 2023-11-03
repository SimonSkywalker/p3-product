'use client'
import React from 'react';
import Link from 'next/link';
import { loginFormSchema } from "@/app/lib/validations/form"
import {useState} from 'react';


export default function registerPage() {

  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [cPassword, setcPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      
    try {
      // Here zod performs it's magic by parsing your data against
      // the schema defined earlier.
      if(cPassword != Password){
        throw new Error("Password doesnt match")
      }

      //Const Username and password is matched with the fields in the form Schema. 
      const validatedData = loginFormSchema.parse({ username:Username, password:Password })
      

      // We send the validated data to the an API endpoint
      // on the server; we will code this later.
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(validatedData),
      }).then((res)=>{res.json}).then((data)=>{console.log(data);
      });
    } catch (err: any) {
      // If parsing fails, you will get a helpful error
      // message about the problem.
      console.log(err.message)
    }
  }
  

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-700">Register</h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
              Username
            </label>
            <input
              type="text" id="username" autoComplete="username" onChange={(e) => setUsername(e.target.value)} value={Username}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password" id="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} value={Password}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-semibold text-gray-800"
            >
              Confirm Password
            </label>
            <input
              type="password" id="repeatPassword" autoComplete='current-password' onChange={(e) => setcPassword(e.target.value)} value={cPassword}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-2">

          <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600" >
            Register
          </button>

          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
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



