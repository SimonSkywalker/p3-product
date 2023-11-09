// public/api/icons.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const iconsDir = path.join(process.cwd(), 'public/icons');
  fs.readdir(iconsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }
    res.status(200).json(files);
  });
}


