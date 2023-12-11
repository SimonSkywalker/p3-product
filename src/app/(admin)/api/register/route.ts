'use server'
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/app/(admin)/classes/userClass"
import { loginFormSchema } from "@/app/(admin)/lib/validations/loginForm";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Parsing the data yet again on the server-side
    // to guarantee 100% security.
    const { username, password } = loginFormSchema.parse(await request.json());
    
    //Hashes password for user security
    let HashedPassword = await bcrypt.hash(password,10);

    //Creates user object with input
    let u : User = new User(username, HashedPassword);
    //Writes to database
    await u.createUser();

    const res = JSON.stringify('it works')
    return new NextResponse(res);
  } catch (err: any) {
    
    return NextResponse.json({error:'User exists'},{status: 409});
    
  }
};