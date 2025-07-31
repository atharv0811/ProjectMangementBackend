import { createTransport } from 'nodemailer';

export const sendMail = async (to: string, subject: string, text: string) => {
    const transporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Atharv Karnekar" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
    });
};
