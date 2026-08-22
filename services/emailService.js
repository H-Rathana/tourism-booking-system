import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export const sendPasswordResetEmail = async (
  email,
  code,
  userName = "Traveler"
) => {
  const info = await transporter.sendMail({
    from: 
    // {
    //   name: "WanderEscape",
    //   address: process.env.SMTP_USER,
    // }
    `"WanderEscape" <${process.env.SMTP_USER}>`
    ,

    to: email,

    subject:
      "Your WanderEscape verification code",

    text: `
Hello ${userName},

We received a request to reset the password
for your WanderEscape account.

Your verification code is:

${code}

This code will expire in 10 minutes.

If you did not request a password reset,
you can safely ignore this email.

WanderEscape Tourism Booking
Your journey starts here.
    `,

    html: `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    WanderEscape Password Reset
  </title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
  "
>

  <div
    style="
      width: 100%;
      padding: 40px 15px;
      box-sizing: border-box;
    "
  >

    <div
      style="
        max-width: 560px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow:
          0 4px 20px
          rgba(15, 23, 42, 0.08);
      "
    >

      <!-- HEADER -->

      <div
        style="
          background: #0ea5e9;
          padding: 28px 30px;
          text-align: center;
        "
      >

        <h1
          style="
            margin: 0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
          "
        >
          WanderEscape
        </h1>

        <p
          style="
            margin: 7px 0 0;
            color: #e0f2fe;
            font-size: 13px;
          "
        >
          Your journey starts here
        </p>

      </div>


      <!-- CONTENT -->

      <div
        style="
          padding: 35px 30px;
        "
      >

        <h2
          style="
            margin: 0 0 15px;
            color: #0f172a;
            font-size: 24px;
          "
        >
          Reset your password
        </h2>


        <p
          style="
            margin: 0 0 15px;
            color: #334155;
            font-size: 15px;
            line-height: 1.7;
          "
        >
          Hello ${userName},
        </p>


        <p
          style="
            margin: 0 0 25px;
            color: #64748b;
            font-size: 15px;
            line-height: 1.7;
          "
        >
          We received a request to reset the
          password for your WanderEscape
          account.
        </p>


        <!-- CODE BOX -->

        <div
          style="
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 25px 15px;
            text-align: center;
            margin: 25px 0;
          "
        >

          <p
            style="
              margin: 0 0 10px;
              color: #64748b;
              font-size: 13px;
            "
          >
            Your verification code
          </p>

          <div
            style="
              color: #0284c7;
              font-size: 34px;
              font-weight: 700;
              letter-spacing: 8px;
            "
          >
            ${code}
          </div>

        </div>


        <p
          style="
            margin: 0 0 20px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
            text-align: center;
          "
        >
          This code will expire in
          <strong>10 minutes</strong>.
        </p>


        <!-- SECURITY MESSAGE -->

        <div
          style="
            background: #f8fafc;
            border-radius: 10px;
            padding: 16px;
            margin-top: 25px;
          "
        >

          <p
            style="
              margin: 0;
              color: #64748b;
              font-size: 13px;
              line-height: 1.6;
            "
          >
            <strong
              style="color: #334155;"
            >
              Didn't request this?
            </strong>

            <br />

            If you didn't request a password
            reset, you can safely ignore this
            email. Your password will remain
            unchanged.
          </p>

        </div>

      </div>


      <!-- FOOTER -->

      <div
        style="
          border-top: 1px solid #e2e8f0;
          padding: 22px 30px;
          text-align: center;
          background: #f8fafc;
        "
      >

        <p
          style="
            margin: 0 0 6px;
            color: #64748b;
            font-size: 13px;
            font-weight: 600;
          "
        >
          WanderEscape Tourism Booking
        </p>

        <p
          style="
            margin: 0;
            color: #94a3b8;
            font-size: 12px;
          "
        >
          Your journey starts here.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
    `,
  });
};
