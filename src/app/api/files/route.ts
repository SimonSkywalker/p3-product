'use server'
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextRequest) {
    const { path: directoryPath } = req.query;

    if (typeof directoryPath !== 'string') {
        return res.status(400).json({ error: 'Invalid directory path' });
    }

    try {
        const directory = path.join(process.cwd(), directoryPath);
        const files = fs.readdirSync(directory);
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}