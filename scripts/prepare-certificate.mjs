import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const source = await readFile('private/certificate.webp');
const jpeg = await sharp(source).flatten({ background: '#ffffff' }).jpeg({ quality: 95 }).toBuffer();
const { width, height } = await sharp(jpeg).metadata();
await writeFile('lib/certificate-template.json', JSON.stringify({ width, height, image: jpeg.toString('base64') }));
