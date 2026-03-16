export const sendWhatsappMessage = async (mobile: string, msg: string) => {
  try {
    const url = `http://wapi.nationalsms.in/wapp/v2/api/send?apikey=${process.env.NATIONALSMS_API_KEY}&mobile=${mobile}&msg=${encodeURIComponent(msg)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WhatsApp failed:', error);
  }
};
