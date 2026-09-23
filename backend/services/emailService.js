import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: `"Career Companion" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Career Companion password",
    text: `You requested a password reset for your Career Companion account.

Use the following link to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can ignore this email.`,
  });
};
