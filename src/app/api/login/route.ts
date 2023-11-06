"use server"
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/app/register/userClass"
import { loginFormSchema } from "@/app/lib/validations/loginForm";
import bcrypt from 'bcrypt';
import userList from '@/app/database/userLogins.json'
import { redirect } from "next/dist/server/api-utils";
import { error } from "console";

export async function POST(request: Request) {
  try {
    // Parsing the data yet again on the server-side
    // to guarantee 100% security.
    const { username, password } = loginFormSchema.parse(await request.json());
    
    // Your server-side logic here...
    let u:User = new User(username, password);
    let u2:User = new User("","");

    userList.forEach((element: any)=>{
        if(element.Username === u.username){
            u2.username = element.Username
            u2.password = element.Password
        }
    })

    let check = await bcrypt.compare(u.password,u2.password)

    if(check){
        console.log("LoggedIn")
    } else {
        throw Error("Wrong Credentials")
    }
    
    return NextResponse.json(200);
  } catch (err: any) {
    return NextResponse.json({error:'Wrong Credentials'},{status:409});
  }
};