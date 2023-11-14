import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex-center fixed top-0 z-50 w-full border-b-2 border-grey-800 bg-grey-800 py-6 text-white'>
      <div className='flex-between mx-auto w-full max-w-screen-2x1 px-6 xs:px-8 sm:px-16'>
        <Link 
            href={"/leaderHome"}
            className='body-text text-gradient_blue-purple !font-bold'>
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
                className='py-2 px-4 rounded body-text text-gradient_blue-purple transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                Login
                </Link>
              </li>
              <li className='py-2'>
                <Link
                href={"/register"}
                className='py-2 px-4 rounded body-text text-gradient_blue-purple transition-all hover:!font-bold hover:outline outline-2 outline-offset-6'>
                Register
                </Link>
              </li>
            </ul>


          </div>
        </div>

        <ul className='flex-center gap-x-3 max-md:hidden md:gap-x-10'>
          <li className='body-text text-gradient_blue-purple !font-bold'>
            <Link 
                href={"/login"}>
                Login
            </Link>
          </li>


          <li className='body-text text-gradient_blue-purple !font-bold'>
            <Link
                href={"/register"}>
                Register
            </Link>
          </li>
          

        </ul>
      </div>
    </nav>
  )
}

export default Navbar