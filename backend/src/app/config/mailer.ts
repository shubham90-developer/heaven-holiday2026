import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log(' Mailer connected successfully');
  } catch (error) {
    console.error(' Mailer connection failed:', error);
  }
};
