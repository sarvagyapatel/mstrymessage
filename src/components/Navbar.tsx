'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { CgLogOut } from "react-icons/cg";
import { CgLogIn } from "react-icons/cg";



function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6  text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </a>
        {session ? (
          <>
            <span className="mr-4 items-center text-xl">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()}>
             <CgLogOut className='text-4xl'/>
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button><CgLogIn className='text-4xl'/></Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;