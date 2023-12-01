
// pages/api/uploadImage.ts
"use server"
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest)
{
    const formData = await req.formData();
    const file = formData.get('file');

    if (file == null) {
        console.log("Error: no file!");
        return NextResponse.json({ status: 500, error: "No file" });
    }

    const name = typeof file === 'string' ? file : file.name || "unknown";
    const size = typeof file === 'string' ? -1 : file.size || -1;

    console.log("file:", file);
    console.log("name:", name, "size:", size);

    //const buffer = await readFileAsBuffer(file);
    const buffer = typeof file !== 'string' ? Buffer.from(await file.arrayBuffer()) : Buffer.from(file);
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(".", "./public/icons");
    console.log("dir:", dir);
    const filename = path.join(dir, name);
    console.log("filename:", filename);

    // Use fs.promises.writeFile for asynchronous file writing
    await fs.promises.writeFile(filename, buffer, 'binary');

    //console.log('Success!');
    const publicUrl = path.join("/public/icons", name);
    console.log("publicUrl:", publicUrl);

    return NextResponse.json({ status: 200, filename: name, size: size });
}

