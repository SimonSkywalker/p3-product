"use server"
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()
    const filePath : string = body.path;

    if (typeof filePath !== 'string') {
        console.log("Invalid file Path");
        return NextResponse.json({ error: 'Invalid file Path' , status: 400});
    }
    try {
        let file = path.join(process.cwd(), filePath);
        let fileData : string = fs.readFileSync(file, 'utf8');
        if (fileData == "")
            return NextResponse.json({data: ""})
        else
            return NextResponse.json({data: JSON.parse(fileData)});
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}
