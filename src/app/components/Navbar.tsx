import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Navbar = () => {
  return (
    
    <nav className='flex-center fixed top-0 z-50 w-full shadow-md bg-white-300 py-6 text-white'>
      <ToastContainer />
      <div className='flex-between mx-auto w-full max-w-screen-2x1 px-6 xs:px-8 sm:px-16'>
        <Link 
            href={"/leaderHome"}
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
              <li className='py-2'>
                <Link
                href={"/login"}
                className='py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                Login
                </Link>
              </li>
              <li className='py-2'>
                <Link
                href={"/register"}
                className='py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                Register
                </Link>
              </li>
              <li className='py-2'>
                <Link
                href={"/about"}
                className='py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                About us
                </Link>
              </li>
            </ul>


          </div>
        </div>

        <ul className='flex-center gap-x-2 max-md:hidden'>
          <li className='py-2'>
            <Link 
                href={"/login"}
                className='py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                Login
            </Link>
          </li>


          <li className='py-2'>
            <Link
                href={"/register"}
                className='py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                Register
            </Link>
          </li>
          
          <li className='py-2'>
            <Link
            href={"/about"}
            className='py-2 px-4 rounded body-text text-palette-400 transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
            About us
            </Link>
          </li>

        </ul>
      </div>
    </nav>
  )
}

export default Navbar