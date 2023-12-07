"use server"
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();

    const filePath : string = body.path;

    if (typeof filePath !== 'string') {
        return NextResponse.json({ error: 'Invalid path' , status: 400});
    }
    try {
        let file = path.join(process.cwd(), filePath);
        fs.rm(file, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Directory ${file} is successfully removed.`);
            }
        });
        return NextResponse.json({status: 200});
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}