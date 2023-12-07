const jwt = require("jsonwebtoken");
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkList } from "@/app/(admin)/classes/userClass";

export async function POST(request: NextRequest, response: NextResponse) {
    
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET); 
    const project = (await request.json()).replace(/(?<!\\)-/g," ").replace(/\\-/g,"-");
    const formslist = (await checkList.findForms(decoded.userId, project)).map((form: {_name: string }) => form._name);
    return new NextResponse(JSON.stringify({Id: decoded.userId, forms: formslist}))

}
