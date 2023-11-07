'use server'
import { useParams } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {

    console.log("Fetch caught");

    const body = await req.json()

    console.log(body);
    const directoryPath = body.path;

    if (typeof directoryPath !== 'string') {
        console.log("HUUUH")
        return NextResponse.json({ error: 'Invalid directory path' },{status:400});
    }
    console.log("Body is correct");

    try {
        const directory = path.join(process.cwd(), directoryPath);
        console.log(directory);
        const files = fs.readdirSync(directory);
        return NextResponse.json(files,{status:200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' },{status:500});
    }
}