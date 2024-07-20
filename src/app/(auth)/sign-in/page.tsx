'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className="bg-blue-900 hover:bg-blue-950 rounded-lg text-white font-semibold px-3 py-1 "  onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold px-3 py-1 " onClick={() => signIn()}>Sign in</button>
    </>
  )
}
