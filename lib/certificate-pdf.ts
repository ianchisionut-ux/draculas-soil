import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import template from './certificate-template.json';
export async function createCertificatePdf(orderNumber: string) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Certificate of Authenticity - ${orderNumber}`);
  pdf.setAuthor("Dracula's Soil");
  const font = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const image = await pdf.embedJpg(template.image);
  const width = 842;
  const imageHeight = width * template.height / template.width;
  const page = pdf.addPage([width, imageHeight + 58]);
  page.drawImage(image, { x: 0, y: 58, width, height: imageHeight });
  const label = `ORDER ${orderNumber}`;
  const size = Math.min(18, 760 / font.widthOfTextAtSize(label, 1));
  page.drawText(label, { x: (width - font.widthOfTextAtSize(label, size)) / 2, y: 30, size, font, color: rgb(0.4, 0.04, 0.06) });
  const caption = 'Unique certificate of authenticity for this order';
  page.drawText(caption, { x: (width - font.widthOfTextAtSize(caption, 10)) / 2, y: 12, size: 10, font });
  return pdf.save();
}
