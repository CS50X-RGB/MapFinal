import nodemailer from 'nodemailer';

const sendEmail = async (userEmail, message) => {
        const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                        user: 'rohanchatterjee866@gmail.com',
                        pass: 'nuyx bjcd cypl pbpb',
                }
        });
        try {
                const info = await transporter.sendMail({
                        from: "rohanchatterjee866@gmail.com",
                        to: userEmail,
                        subject: "Welcome to Map-o-Share",
                        text: message,
                        html: `<div>${message}</div>`
                });

                console.log("Email sent:", info.messageId);
        } catch (error) {
                console.error("Error sending email:", error);
                throw error;
        }
};
export default sendEmail;