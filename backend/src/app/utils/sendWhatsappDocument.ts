import axios from 'axios';

export const sendWhatsappDocument = async (
  phone: string,
  fileUrl: string,
  fileName: string,
  caption?: string,
  mimetype?: string,
): Promise<void> => {
  try {
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      console.error('WhatsApp credentials not configured');
      return;
    }

    // Determine if file is PDF or image based on URL
    const isPdf =
      fileUrl.toLowerCase().includes('.pdf') ||
      fileUrl.toLowerCase().includes('/raw/upload/'); // Cloudinary raw = pdf

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    const payload = isPdf
      ? {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phone,
          type: 'document',
          document: {
            link: fileUrl,
            filename: fileName,
            caption: caption || '',
          },
        }
      : {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phone,
          type: 'image',
          image: {
            link: fileUrl,
            caption: caption || '',
          },
        };

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`WhatsApp document sent to ${phone}`);
  } catch (error: any) {
    console.error(
      'WhatsApp document send failed:',
      error?.response?.data || error.message,
    );
  }
};
