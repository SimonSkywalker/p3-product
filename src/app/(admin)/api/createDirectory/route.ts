"use server"
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();

    const dirPath : string = body.path;

    if (typeof dirPath !== 'string') {
        console.log("Invalid path");
        return NextResponse.json({ error: 'Invalid path' , status: 400});
    }
    try {
        let directory = path.join(process.cwd(), dirPath);
        fs.mkdir(directory, err => {
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