const jwt = require("jsonwebtoken");
import { checkList } from "@/app/classes/userClass";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises"

export async function POST(request: NextRequest, response: NextResponse){
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET);
    const selectedForm = await request.json();
    const projectName = 'Project 1';
    
    const roleslist = await checkList.findRoles(decoded.userId, projectName, selectedForm)
    const questionList = await checkList.getQuestions(decoded.userId, projectName, selectedForm)
    const path = process.cwd() + `/src/app/database/${decoded.userId}/${projectName}/${selectedForm}/responses.json`;
    
    const responseFile = await fs.readFile(path, "utf8")
    .then((responses) => {
        return JSON.parse(responses);
    })
    .catch((error) => {
        // Handle errors
        console.error('Error reading forms:', error);
        return [];
    });

    return new NextResponse(JSON.stringify({formdata: {roles: roleslist, selectedForm: selectedForm, questions: questionList}, mResponse: responseFile}), {status: 200})
    
} 