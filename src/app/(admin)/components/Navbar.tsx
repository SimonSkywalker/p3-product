'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/context/Auth';

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  


  return (
    
    <nav className='flex-center sticky top-0 z-50 w-full shadow-md bg-white-300 py-6 text-white'>
      <ToastContainer />
      
      <div className='flex-between mx-auto w-full max-w-screen-2x1 px-6 xs:px-8 sm:px-16'>
        <Link 
            href={isLoggedIn ? "/projectCreation" : "/"}
            className='body-text text-palette-400 !font-bold'>
            Project Administration
        </Link>

        <div>
        <label 
          className='hamburger-menu block md:hidden'>
          <input
            type='checkbox'
            >
          </input>
        </label>
          <div className='sidebar block md:hidden absolute top-0  right-0 botton-0 w-full h-screen text-center '>
            <ul className=" gap-x-3">
              {isLoggedIn ? (
              <>
              <li 
              className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
              onClick={()=>{
                logout();
                router.push('/login')
              }}>
                Logout 
              </li>

              <li 
                className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
                onClick={()=>{router.push('/about')}}
              >
                About us
              </li>

              </>
              ) : (
              <>
              <li
                className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
                onClick={()=>router.push('/login')}
              >
                Login
              </li>

              <li
                className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
                onClick={()=>router.push('/register')}
              >
                Register
              </li>
              
              <li
                className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
                onClick={()=>router.push("/about")}
              >
                About us
              </li>
              </>
              )}
            </ul>
          </div>
        </div>



        <ul className='flex-center gap-x-2 max-md:hidden'>
          
        {isLoggedIn ? (
        <>
          <li 
          className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
          onClick={()=>{
            logout();
            router.push('/login')
          }}>
            Logout 
          </li>

          <li 
            className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
            onClick={()=>{router.push('/about')}}
            >
            About us
          </li>

        </>
      ) : (
        <>
          <li
            className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
            onClick={()=>router.push('/login')}
          >
            Login
          </li>


          <li
            className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
            onClick={()=>router.push('/register')}
          >
            Register
          </li>
          
          <li
            className='cursor-pointer py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'
            onClick={()=>router.push("/about")}
            >
            About us
          </li>
        </>
      )}

          

        </ul>
      </div>
    </nav>
  )
}

export default Navbar