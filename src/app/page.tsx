import Image from 'next/image'
import Link from 'next/link'

/**
 * Function to link to the starting pages
 * @returns Markup of the page
 */
export default function Home() {
  return (
        <div className="className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'">
          <h1>Welcome to Project survey tool</h1>
          <Link 
            className="border-white border-2 p-2" 
            href={"/leaderHome"}>
              LH
          </Link><br />
          <Link 
            className="border-white border-2 p-2" 
            href={"/login"}>
              Login
          </Link><br />
          <Link 
            className="border-white border-2 p-2" 
            href={"/register"}>
              Register
          </Link><br />
        </div>
  )
}
