import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Welcome to Project survey tool</h1>
      <div className='flex flex-wrap content-evenly'>
        <Link className="border-white border-2 p-2" href={"/projectCreation"}>Projects</Link><br />
        <Link className="border-white border-2 p-2" href={"/login"}>Login</Link><br />
        <Link className="border-white border-2 p-2" href={"/register"}>Register</Link><br />
      </div>
    </main>
  )
}


