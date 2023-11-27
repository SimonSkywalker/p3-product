import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='text-palette-400 justify-end flex-between body-text w-full gap-y-10 shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.10)] bg-white-300 px-20 py-1 max-md:flex-col'>
      <p>Copyright © 2023 | All Rights Reserved</p>

      <div className='flex gap-x-9'>
        <Link href="/terms-of-use">Terms & Conditions
        </Link>
        <Link href="/privacy-policy">Privacy Policy
        </Link>
      </div>
    </footer>
  )
}

export default Footer