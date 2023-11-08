import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex-center paddings mx-auto w-full max-w-screen-2xl flex-col">
      <section className="nav-padding w-full">
        
        <div className="flex-center relative min-h-[274px] w-full flex-col rounded-xl bg-banner bg-cover bg-center text-center">
          <h1>Welcome to Project survey tool</h1>
          <Link className="border-white border-2 p-2" href={"/leaderHome"}>LH</Link><br />
          <Link className="border-white border-2 p-2" href={"/login"}>Login</Link><br />
          <Link className="border-white border-2 p-2" href={"/register"}>Register</Link><br />
        </div>
      </section>
    </main>
  )
}
