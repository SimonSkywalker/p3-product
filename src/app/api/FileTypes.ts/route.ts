"use server"
import FileTypes from '@/app/projectCreation/FileTypes';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, res: NextResponse) {

    console.log("pee");
    const body = await req.json()

    console.log(body);
    const filePath : string = body.path;
    console.log(filePath)

    if (typeof filePath !== 'string') {
        console.log("ERROR BITCH");
        return NextResponse.json({ error: 'Invalid file Path' , status: 400});
    }
    try {
        let file = path.join(process.cwd(), filePath);
        
        console.log(file);
        //If a directory of the desired name is found
        if (fs.lstatSync(file).isDirectory()){
            console.log("it's a directory")
            return NextResponse.json({fileType: FileTypes.directory, status: 200});
            console.log("Why are we still here?");
        }  else if (fs.lstatSync(file).isFile()){
            console.log("it's a file");
            return NextResponse.json({fileType: FileTypes.JSON, status: 200});
        }  else {
            return NextResponse.json({fileType: FileTypes.other, status: 200});
            console.log("Just to suffer?");
        } 
    }
    catch (error) {
        console.log("IEEEEEEEEEEEEH")
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', status: 500});
    }
}