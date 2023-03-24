import { createTransport } from "nodemailer";
import env from "../../config";
import getOtpEmailTemplate from "./templates/otp.email";

/**
 * Sends an email message using Nodemailer.
 * 
 * @param {Object} params - An object containing email parameters.
 * @param {string} params.to - The email address to send the message to.
 * @param {string} params.subject - The subject of the email message.
 * @param {Object} params.OTP - The OTP for the verification and validity of the otp.
 * @throws {TypeError} If any of the parameters are not strings, or are empty or whitespace-only strings.
 * @returns {Promise} A Promise that resolves when the email has been sent.
 */
const sendMail = async ({ to, subject = "No subject", OTP }) => {
  if (typeof to !== "string" || !to.trim() ) {
    throw new TypeError("The 'to' parameter must be a non-empty string.");
  }

  if (typeof subject !== "string" || !subject.trim()) {
    throw new TypeError("The 'subject' parameter must be a non-empty string.");
  }

  if (typeof OTP !== "object") {
    throw new TypeError("The 'OTP' parameter must be a non-empty string.");
  }

  const message = {
    from: env.EMAIL,
    to,
    subject,
    html: getOtpEmailTemplate(OTP.otp, OTP.validFor )
  };

  const response = await mailTransport.sendMail(message);
};

const mailTransport = createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL,
    pass: env.MAIL_SECRETE,
  },
  secure: false,
});

export default sendMail;
