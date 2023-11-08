import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex-center fixed top-0 z-50 w-full border-b-2 border-grey-800 bg-grey-800 py-3 text-white'>
      <div className='flex-between mx-auto w-full max-w-screen-2x1 px-6 xs:px-8 sm:px-16'>
        <Link 
            href={"/leaderHome"}
            className='body-text text-gradient_blue-purple !font-bold'>
            Project Administration
        </Link>

        <Image
          src="hamburger-menu.svg"
          width={30}
          height={30}
          alt="Hamburger menu"
          className='block md:hidden'  
        />

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