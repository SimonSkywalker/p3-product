'use client'
import React from 'react'
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Token } from '../classes/tokenClass'

export default function leaderHome() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token)
    if (!token) {
      router.replace("/"); // If no token is found, redirect to login page
      return;
    }
      // Validate the token by making an API call
       Token.validateToken(token).catch((error) => {
          console.error(error);
          router.replace("/login"); // Redirect to login if token validation fails
        })

    }, [router]);
  return (
    <div>Projects</div>
  )
}

