"use server"
import NoFileNameException from '@/app/exceptions/NoFileNameException';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextRequest, res: NextResponse) {

    const body = await req.json()

    console.log(body);
    const filePath = body.path;

    if (filePath !== 'string') {
        return NextResponse.json({ error: 'Invalid file Path' , status: 400});
    }

    try {
        let file = path.join(process.cwd(), filePath);

        fs.readFile(file, function (err, file) {
                fs.stat(file, function (error, stat : any) {
                    if (error) {
                      throw NoFileNameException;
                    }
                    //If a directory of the desired name is found
                    if (stat.isDirectory())
                        res.status(200).json("directory");
                    else if (stat.isFile())
                        res.status(200).json("file");
                    else
                        return NextResponse({})
                    });
              
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
}

