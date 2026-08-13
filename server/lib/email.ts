import { logger } from '../utils/logger'
import { Resend } from "resend";

export const sendContactNotification = async (
  to: string,
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  const config = useRuntimeConfig();

  const apiKey = config.resendApiKey as string | undefined;
  if (!apiKey) {
    logger.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: `Portfolio Contact <no-reply@eka-dev.cloud>`,
    to,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html: `
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse:collapse;width:100%;max-width:600px;">
                <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${name}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Email</td><td style="padding:8px 12px;border:1px solid #ddd;">${email}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Subject</td><td style="padding:8px 12px;border:1px solid #ddd;">${subject}</td></tr>
                <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Message</td><td style="padding:8px 12px;border:1px solid #ddd;">${message}</td></tr>
            </table>
        `,
  });
};
