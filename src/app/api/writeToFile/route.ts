"use server"
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()
    const filePath : string = body.path;
    const data : Array<Object> = body.data;

    if (typeof filePath !== 'string') {
        console.log("Invalid file Path");
        return NextResponse.json({ error: 'Invalid file Path' , status: 400});
    }
    try {
        let file = path.join(process.cwd(), filePath);
        fs.writeFile(file, JSON.stringify(data), err => {
            if (err) {
                console.error(err);
                return NextResponse.json({ error: 'Internal server error', status: 500});
            }
        })
        return NextResponse.json({status: 200});
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}