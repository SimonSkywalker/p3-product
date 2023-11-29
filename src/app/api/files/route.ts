'use server'
import { useParams } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
    const body = await req.json()
    const directoryPath = body.path;

    if (typeof directoryPath !== 'string') {
        console.log("Invalid directory path")
        return NextResponse.json({ error: 'Invalid directory path' },{status:400});
    }

    try {
        const directory = path.join(process.cwd(), directoryPath);
        const files = fs.readdirSync(directory);
        return NextResponse.json(files,{status:200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' },{status:500});
    }
}
