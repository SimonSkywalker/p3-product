"use server"
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/app/register/userClass"
import { loginFormSchema } from "@/app/lib/validations/loginForm";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    // Parsing the data yet again on the server-side
    // to guarantee 100% security.
    const { username, password } = loginFormSchema.parse(await request.json());
    
    // Your server-side logic here...
    let HashedPassword = await bcrypt.hash(password,10);
    User.main(username, HashedPassword);
    
    return new NextResponse('it works');
  } catch (err: any) {
    throw err
    return new NextResponse("this is an error");
  }
};