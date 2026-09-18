import template from './certificate-template.json';

const encoder = new TextEncoder();
const PAGE_WIDTH = 842;
const FOOTER_HEIGHT = 58;

function ascii(value: string) {
  return encoder.encode(value);
}

function pdfText(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function object(number: number, body: string | Uint8Array) {
  const start = ascii(`${number} 0 obj\n`);
  const end = ascii('\nendobj\n');
  return typeof body === 'string' ? [start, ascii(body), end] : [start, body, end];
}

function combine(chunks: Uint8Array[]) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}

export function createCertificatePdf(orderNumber: string) {
  const image = decodeBase64(template.image);
  const imageHeight = PAGE_WIDTH * template.height / template.width;
  const pageHeight = imageHeight + FOOTER_HEIGHT;
  const label = `ORDER ${orderNumber}`;
  const labelX = Math.max(30, (PAGE_WIDTH - label.length * 9) / 2);
  const caption = 'Unique certificate of authenticity for this order';
  const captionX = (PAGE_WIDTH - caption.length * 5.1) / 2;
  const content = [
    `q ${PAGE_WIDTH} 0 0 ${imageHeight.toFixed(3)} 0 ${FOOTER_HEIGHT} cm /Certificate Do Q`,
    `BT /F1 18 Tf 0.4 0.04 0.06 rg ${labelX.toFixed(2)} 30 Td (${pdfText(label)}) Tj ET`,
    `BT /F2 10 Tf 0 0 0 rg ${captionX.toFixed(2)} 12 Td (${caption}) Tj ET`,
  ].join('\n');
  const contentBytes = ascii(content);

  const bodies: Uint8Array[][] = [
    object(1, '<< /Type /Catalog /Pages 2 0 R >>'),
    object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${pageHeight.toFixed(3)}] /Resources << /XObject << /Certificate 4 0 R >> /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >>`),
    object(4, combine([
      ascii(`<< /Type /XObject /Subtype /Image /Width ${template.width} /Height ${template.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`),
      image,
      ascii('\nendstream'),
    ])),
    object(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>'),
    object(6, '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>'),
    object(7, combine([ascii(`<< /Length ${contentBytes.length} >>\nstream\n`), contentBytes, ascii('\nendstream')])),
    object(8, `<< /Title (Certificate of Authenticity - ${pdfText(orderNumber)}) /Author (Dracula's Soil) >>`),
  ];

  const header = combine([ascii('%PDF-1.7\n%'), new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3]), ascii('\n')]);
  const chunks: Uint8Array[] = [header];
  const offsets = [0];
  let offset = header.length;
  for (const body of bodies) {
    offsets.push(offset);
    const bytes = combine(body);
    chunks.push(bytes);
    offset += bytes.length;
  }
  const xrefOffset = offset;
  const xref = [
    `xref\n0 ${bodies.length + 1}\n`,
    '0000000000 65535 f \n',
    ...offsets.slice(1).map(value => `${String(value).padStart(10, '0')} 00000 n \n`),
    `trailer\n<< /Size ${bodies.length + 1} /Root 1 0 R /Info 8 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  ].join('');
  chunks.push(ascii(xref));
  return combine(chunks);
}
