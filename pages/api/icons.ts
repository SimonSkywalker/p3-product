// pages/api/icons.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const iconsDir = path.join(process.cwd(), 'public/icons');
  
  if (!fs.existsSync(iconsDir)) {
    return res.status(404).json({ error: 'Directory not found' });
  }

  fs.readdir(iconsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Unable to read directory' });
    }
    res.status(200).json(files);
  });
}

