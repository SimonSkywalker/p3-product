// public/api/icons.js
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export default function handler(req: NextRequest, res: NextResponse) {
  const iconsDir = path.join(process.cwd(), 'public/icons');
  fs.readdir(iconsDir, (err, files) => {
    if (err) {
      return NextResponse.json({ error: 'Unable to read directory' }, {status: 500});
    }
    NextResponse.json(files, {status: 200});
  });
}


