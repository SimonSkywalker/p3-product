'use server'
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/app/classes/userClass"
import { loginFormSchema } from "@/app/lib/validations/loginForm";
import bcrypt from 'bcrypt';
import { RegisterException } from "@/app/exceptions/RegisterException";

export async function POST(request: NextRequest) {
  try {
    // Parsing the data yet again on the server-side
    // to guarantee 100% security.
    const { username, password } = loginFormSchema.parse(await request.json());
    
    // Your server-side logic here...
    let HashedPassword = await bcrypt.hash(password,10);
    let u:User = new User(username, HashedPassword);
    u.createUser();    
    const res = JSON.stringify('it works')
    return new NextResponse(res);
  } catch (err: any) {
    
    return NextResponse.json({error:'Wrong credentials'},{status: 409});
    
  }
};