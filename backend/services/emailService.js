import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: `"Career Companion" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export const sendPasswordResetEmail = async (
  email,
  resetUrl,
  isFirstPassword,
) => {
  const subject = isFirstPassword
    ? "Set your Career Companion password"
    : "Reset your Career Companion password";

  const actionText = isFirstPassword
    ? "You created your Career Companion account using Google Sign-In. You can now set a password to also sign in with your email and password."
    : "You requested a password reset for your Career Companion account.";

  await sendEmail({
    to: email,
    subject,
    text: `${actionText}

Use the following link:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this, you can ignore this email.`,
  });
};
