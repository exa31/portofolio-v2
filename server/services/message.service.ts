import * as repository from "~~/server/repositories/message.repository";
import { H3Event } from "h3";
import {
  CreateMessageInput,
  UpdateMessageStatusInput,
} from "~~/server/model/message.model";
import { withTransaction } from "~~/server/db/postgres";
import { HttpError } from "~~/server/errors/HttpError";
import { sendSuccess } from "~~/server/utils/response";
import { sendContactNotification } from "~~/server/lib/email";
import * as settingsRepository from "~~/server/repositories/settings.repository";

export const createMessage = async (
  event: H3Event,
  body: CreateMessageInput,
) => {
  const { messageId, adminEmail } = await withTransaction(async (client) => {
    const id = await repository.createMessage(client, body);
    if (!id) {
      throw new HttpError(
        500,
        "MESSAGE_CREATION_FAILED",
        "Failed to create message",
      );
    }

    const settings = await settingsRepository.getUserSettings(client);
    const email = settings?.email;

    return { messageId: id, adminEmail: email };
  });

  if (adminEmail) {
    sendContactNotification(
      adminEmail,
      body.name,
      body.email,
      body.subject,
      body.message,
    ).catch((err) =>
      console.error("[Email] Failed to send notification:", err),
    );
  }

  return sendSuccess(
    event,
    { message_id: messageId },
    "Message created successfully",
    "message_created",
    201,
  );
};

export const getMessagesByCursor = async (
  event: H3Event,
  limit: number,
  status: "unread" | "read",
  cursor?: number,
) => {
  return withTransaction(async (client) => {
    const { messages, has_next } = await repository.getMessagesByCursor(
      client,
      limit,
      status,
      cursor,
    );
    return sendSuccess(
      event,
      {
        data: messages,
        has_next: has_next,
      },
      "Messages retrieved successfully",
      "messages_retrieved",
    );
  });
};

export const getMessageById = async (event: H3Event, id: string) => {
  return withTransaction(async (client) => {
    const message = await repository.getMessageById(client, id);
    if (!message) {
      throw new HttpError(404, "MESSAGE_NOT_FOUND", "Message not found");
    }
    return sendSuccess(
      event,
      message,
      "Message retrieved successfully",
      "message_retrieved",
    );
  });
};

export const updateMessageStatus = async (
  event: H3Event,
  data: UpdateMessageStatusInput,
) => {
  return withTransaction(async (client) => {
    const message = await repository.getMessageById(client, data.id);
    if (!message) {
      throw new HttpError(404, "MESSAGE_NOT_FOUND", "Message not found");
    }

    const ok = await repository.updateMessageStatus(client, data.id, data);
    if (!ok) {
      throw new HttpError(
        500,
        "MESSAGE_UPDATE_FAILED",
        "Failed to update message status",
      );
    }

    return sendSuccess(
      event,
      { message_id: data.id },
      "Message status updated successfully",
      "message_updated",
      200,
    );
  });
};

export const deleteMessage = async (event: H3Event, id: string) => {
  return withTransaction(async (client) => {
    const message = await repository.getMessageById(client, id);
    if (!message) {
      throw new HttpError(404, "MESSAGE_NOT_FOUND", "Message not found");
    }

    const ok = await repository.deleteMessage(client, id);
    if (!ok) {
      throw new HttpError(
        500,
        "MESSAGE_DELETION_FAILED",
        "Failed to delete message",
      );
    }

    return sendSuccess(
      event,
      { message_id: id },
      "Message deleted successfully",
      "message_deleted",
      200,
    );
  });
};
