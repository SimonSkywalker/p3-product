import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <div className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'>
      <h1>Welcome to Project survey tool</h1>
        <div className='flex flex-wrap content-evenly'>
          This proof of concept was made by cs-23-sw-3-01 on semester 3 AAU Software
        </div>
      </div>
    </main>
  )
}