import puppeteer from 'puppeteer';
import { generateTourHtml } from './generateTourHtml';

export const generateTourPdf = async (
  tour: any,
  contactDetails?: any,
  settings?: any,
): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to A4 dimensions
    await page.setViewport({ width: 794, height: 1123 });

    const html = generateTourHtml(tour, contactDetails, settings);

    // Set content and wait for images to load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // IMPORTANT: needed for colored backgrounds
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    // Always close browser to prevent memory leaks
    await browser.close();
  }
};
