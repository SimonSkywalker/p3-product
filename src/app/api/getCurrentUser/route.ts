const jwt = require("jsonwebtoken");
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest, response: NextResponse) {
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET); 
    return new NextResponse(JSON.stringify({Id: decoded.userId}))
}