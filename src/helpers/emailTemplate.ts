// types
import { OtpTemplateInputType } from "../types/helpersTypes";

export const otpTemplate = (params: OtpTemplateInputType): string => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>

        <style>
            .container {
                font-family: Helvetica, Arial, sans-serif;
                min-width: 1000px;
                overflow: auto;
                line-height: 2;
            }

            .content {
                margin: 50px auto;
                width: 70%;
                padding: 20px 0;
            }

            .header {
                border-bottom: 1px solid #eee;
            }

            .brand-link {
                font-size: 1.4em;
                color: #00466a;
                text-decoration: none;
                font-weight: 600;
            }

            .greeting {
                font-size: 1.1em;
            }

            .otp-code {
                background: #00466a;
                margin: 0 auto;
                width: max-content;
                padding: 0 10px;
                color: #fff;
                border-radius: 4px;
            }

            .regards {
                font-size: 0.9em;
            }

            .divider {
                border: none;
                border-top: 1px solid #eee;
            }

            .address {
                float: right;
                padding: 8px 0;
                color: #aaa;
                font-size: 0.8em;
                line-height: 1;
                font-weight: 300;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div class="header">
                    <a href="" class="brand-link">Nyebarin.com</a>
                </div>
                <p class="greeting">Hi, ${params.name}</p>
                <p>Terima kasih telah menunggu. Gunakan OTP berikut untuk menyelesaikan prosedur <b>pendaftaran akun</b>. OTP ini berlaku selama ${params.expired/60} menit.</p>
                <h2 class="otp-code">${params.code}</h2>
                <p class="regards">Hormat kami, <br />Nyebarin.com</p>
                <hr class="divider" />
                <div class="address">
                    <p>Nyebarin.com</p>
                    <p>Indonesia</p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
};
