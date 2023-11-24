const jwt = require("jsonwebtoken");
import { checkList } from "@/app/classes/userClass";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, response: NextResponse){
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET);
    const selectedForm = await request.json();

    const roleslist = await checkList.findRoles(decoded.userId, 'Project 1', selectedForm)
    const questionList = await checkList.getQuestions(decoded.userId, 'Project 1', selectedForm)

    return new NextResponse(JSON.stringify({roles: roleslist, questions: questionList}), {status: 200})
    
} 