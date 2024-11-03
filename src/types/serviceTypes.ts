/**
 * Email Services Types
 * --------------------
 */
export interface SendEmailInputType {
  to: string;
  subject: string;
  text: string;
  html: string;
}
