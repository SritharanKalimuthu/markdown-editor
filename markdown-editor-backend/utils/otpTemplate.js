export default function generateOtpEmailTemplate(otpCode, userEmail, userName) {
  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Port+Lligat+Sans&display=swap" rel="stylesheet">
        <title>Your OTP Code</title>
        <style>
          body {
            background-color:rgb(192, 185, 185);
            font-family: "Port Lligat Sans", sans-serif;
        font-weight: 400;
        font-style: normal;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 480px;
            background: white;
            margin: 40px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            text-align: center;
          }
          h1 {
            color:rgb(165, 125, 228);
          }
          p {
            font-size: 16px;
            margin: 20px 0;
        padding:5px 0;
        line-height:24px;
          }
          .otp {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            background: rgb(165, 125, 228);
            color: white;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 6px;
            user-select: all;
          }
          .footer {
            font-size: 12px;
            color: #888;
            margin-top: 30px;
          }
          @media only screen and (max-width: 500px) {
            .container {
              margin: 20px;
              padding: 20px;
            }
            .otp {
              font-size: 28px;
              letter-spacing: 6px;
              padding: 8px 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>One-Time Password (OTP)</h1>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Use the following OTP to complete your login or registration. This code is valid for <strong>5 minutes</strong>.</p>
          <div class="otp">${otpCode}</div>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} @MDEditor. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `;
}
