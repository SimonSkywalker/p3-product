"use server"
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();

    const filePath : string = body.path;
    const newPath : string = body.newPath;

    if (typeof filePath !== 'string') {
        console.log("ERROR BITCH");
        return NextResponse.json({ error: 'Invalid path' , status: 400});
    }
    try {
        let file = path.join(process.cwd(), filePath);
        let newFile = path.join(process.cwd(), newPath);
        fs.rename(file, newFile, err => {
            if (err) {
                console.error(err);
            }
        })
        return NextResponse.json({status: 200});
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}