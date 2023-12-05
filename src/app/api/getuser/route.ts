const jwt = require("jsonwebtoken");
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkList } from "@/app/classes/userClass";

export async function GET(request: NextRequest, response: NextResponse) {
    
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET); 
    const formslist = await checkList.findForms(decoded.userId, 'Project 1')
    return new NextResponse(JSON.stringify({Id: decoded.userId, project: 'Project 1', forms: formslist}))
    //return NextResponse.json({status: 200})

}
