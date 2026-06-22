import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (email: string, otp: string) => {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Welcome To Recipe APP",
    html: `
     
  <div
    style="background: #f4f7f5; padding: 30px; font-family: Arial, sans-serif"
  >
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      "
    >
      <div style="background: #077442; padding: 30px; text-align: center">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px">RECIPE APP</h1>
      </div>

      <div style="padding: 40px 30px; text-align: center">
        <h2 style="color: #333333; margin-bottom: 15px">
          Verify Your Email Address
        </h2>

        <p style="color: #666666; font-size: 16px; line-height: 1.6">
          Welcome to Recipe App! Use the verification code below
        </p>

        <div style="margin: 30px 0">
          <span
            style="
              display: inline-block;
              background: #077442;
              color: #ffffff;
              padding: 16px 40px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              border-radius: 10px;
            "
          >
            ${otp}
          </span>
        </div>

        <p style="color: #666666; font-size: 15px">
          This OTP is valid for <strong>3 minutes</strong>.
        </p>

        <p style="color: #999999; font-size: 14px; margin-top: 25px">
          If you didn't request this verification, please ignore this email.
        </p>
      </div>

      <div
        style="
          background: #f7f7f7;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #eeeeee;
        "
      >
        <p style="margin: 0; color: #777777; font-size: 13px">
          © 2026 Recipe App. All rights reserved.
        </p>
      </div>
    </div>
  </div>


      `,
  });
};
