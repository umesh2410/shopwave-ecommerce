const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER || 'johndoe@ethereal.email',
            pass: process.env.SMTP_PASS || 'password123'
        }
    });
};

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: '"EliteBazaar Support" <support@elitebazaar.com>',
            to,
            subject,
            html: htmlContent
        });

        console.log(`Email sent: ${info.messageId}`);
        // If using Ethereal, you can view the email here:
        if (info.messageId && process.env.SMTP_HOST?.includes('ethereal')) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const sendWelcomeEmail = async (userEmail, userName) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
                <h2>Welcome to EliteBazaar!</h2>
            </div>
            <div style="padding: 20px; color: #333;">
                <p>Hi ${userName},</p>
                <p>Thank you for joining EliteBazaar, your premium destination for curated tech and fashion.</p>
                <p>We are thrilled to have you on board. Start exploring our latest collections today!</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>The EliteBazaar Team</strong></p>
            </div>
        </div>
    `;
    return await sendEmail(userEmail, 'Welcome to EliteBazaar!', html);
};

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
                <h2>Order Confirmed!</h2>
            </div>
            <div style="padding: 20px; color: #333;">
                <p>Thank you for your purchase.</p>
                <p>Your order <strong>#${orderDetails.id.substring(0, 8)}</strong> has been confirmed and is currently being processed.</p>
                <p><strong>Total Amount:</strong> ₹${orderDetails.total_amount}</p>
                <p>We will notify you once your items have shipped.</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>The EliteBazaar Team</strong></p>
            </div>
        </div>
    `;
    return await sendEmail(userEmail, `Order Confirmation - #${orderDetails.id.substring(0, 8)}`, html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendOrderConfirmationEmail
};
