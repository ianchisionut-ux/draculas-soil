import { mkdir, writeFile } from 'node:fs/promises';
import { createCertificatePdf } from '../lib/certificate-pdf';
import QRCode from 'qrcode';
import { certificateToken } from '../lib/certificate-access';

async function main() {
  const dir = '.next/certificate-qa';
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/sample.pdf`, await createCertificatePdf('DS-100234'));
  process.env.AUTH_SECRET = 'local-qa-only';
  const url = `https://draculasoil.com/certificate?order=sample-order&token=${certificateToken('sample-order')}`;
  await QRCode.toFile(`${dir}/qr.png`, url, { width: 320, margin: 4, errorCorrectionLevel: 'M' });
  console.log('PDF and QR generated in .next/certificate-qa');
}
main().catch(err => { console.error(err); process.exitCode = 1; });
