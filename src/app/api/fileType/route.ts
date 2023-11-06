"use server"
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filePath } = req.query;

    if (filePath !== 'string') {
        return res.status(400).json({ error: 'Invalid file Path' });
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
                    });
              
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
}

