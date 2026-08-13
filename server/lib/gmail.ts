import { logger } from "../utils/logger";
import { OAuth2Client } from "google-auth-library";
import { HttpError } from "~~/server/errors/HttpError";

function getOAuth2Client(): OAuth2Client {
  const config = useRuntimeConfig();
  const clientId = config.googleClientId as string;
  const clientSecret = config.googleClientSecret as string;

  if (!clientId || !clientSecret) {
    throw new HttpError(
      500,
      "GOOGLE_OAUTH_NOT_CONFIGURED",
      "Google OAuth credentials not configured",
    );
  }

  return new OAuth2Client({
    clientId,
    clientSecret,
  });
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string = "postmessage",
): Promise<{
  email: string;
  refresh_token: string | null;
  access_token: string;
  expires_at: Date;
}> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken({
    code,
    redirect_uri: redirectUri,
  });

  if (!tokens.access_token) {
    throw new HttpError(
      400,
      "GMAIL_AUTH_FAILED",
      "Failed to get access token from Google",
    );
  }

  oauth2Client.setCredentials(tokens);

  const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token);

  return {
    email: tokenInfo.email || "",
    refresh_token: tokens.refresh_token || null,
    access_token: tokens.access_token,
    expires_at: tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600000),
  };
}

export async function sendEmail(
  accessToken: string,
  fromEmail: string,
  to: string,
  subject: string,
  bodyText: string,
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: string;
    mimeType: string;
  }>,
): Promise<void> {
  const email = buildMimeMessage(fromEmail, to, subject, bodyText, attachments);

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: email }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error({ status: response.status, errorBody }, "[Gmail] Send error:");
    throw new HttpError(
      500,
      "GMAIL_SEND_FAILED",
      `Failed to send email: ${response.status}`,
    );
  }
}

function buildMimeMessage(
  from: string,
  to: string,
  subject: string,
  bodyText: string,
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: string;
    mimeType: string;
  }>,
): string {
  const boundary = `==boundary_${Date.now()}_${Math.random().toString(36).slice(2)}==`;
  const lines: string[] = [];

  lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  lines.push(`Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`);
  lines.push("MIME-Version: 1.0");
  lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  lines.push("");

  lines.push(`--${boundary}`);
  lines.push('Content-Type: text/plain; charset="UTF-8"');
  lines.push("Content-Transfer-Encoding: base64");
  lines.push("");
  lines.push(Buffer.from(bodyText, "utf-8").toString("base64"));

  if (attachments && attachments.length > 0) {
    for (const att of attachments) {
      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${att.mimeType}; name="${att.filename}"`);
      lines.push("Content-Transfer-Encoding: base64");
      lines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
      lines.push("");
      lines.push(att.content);
    }
  }

  lines.push(`--${boundary}--`);

  const raw = lines.join("\r\n");
  return Buffer.from(raw, "utf-8").toString("base64url");
}

export async function fetchAttachmentBuffer(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new HttpError(
      500,
      "FETCH_ATTACHMENT_FAILED",
      `Failed to fetch attachment: ${response.status}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
