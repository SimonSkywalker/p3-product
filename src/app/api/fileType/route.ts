"use server"
import FileTypes from './FileTypes';
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
        
        //If a directory of the desired name is found
        if (fs.lstatSync(file).isDirectory()){
            return NextResponse.json({fileType: FileTypes.directory, status: 200});
        }  else if (fs.lstatSync(file).isFile()){
            return NextResponse.json({fileType: FileTypes.JSON, status: 200});
        }  else {
            return NextResponse.json({fileType: FileTypes.other, status: 200});
        } 
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}