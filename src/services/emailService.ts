// libs
import nodemailer, { TransportOptions } from "nodemailer"
// configs
import { emailConfig } from "../configs"
// types
import { SendEmailInputType } from "../types/serviceTypes";
import { ResponseFormatType } from "../types/helpersTypes";

class EmailService {
  private static transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  } as TransportOptions);

  static async sendMail(
    params: SendEmailInputType
  ): Promise<ResponseFormatType<void>> {
    try {
      const info = await this.transporter.sendMail({
        from: emailConfig.user,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });

      return {
        statusCode: 200,
        message: "send email success",
      };
    } catch (error: any) {
      console.log("error - sendMail - emailService.ts:", error.message);
      throw new Error("error sending email");
    }
  }
}

export default EmailService;
