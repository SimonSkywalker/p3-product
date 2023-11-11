// /src/app/api/getIconsList/route.ts
'use server'

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    const iconsDir = path.join(process.cwd(), '/public/icons');

    if (!fs.existsSync(iconsDir)) {
        console.log('Directory not found');
        return NextResponse.json({error: 'Directory not found'}, {status: 404});
    }

    try {
        const files = await fs.promises.readdir(iconsDir);
        return NextResponse.json({data: files}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: 'Unable to read directory'}, {status: 500});
    }
}
