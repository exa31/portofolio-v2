import * as repository from "~~/server/repositories/message.repository";
import {H3Event} from "h3";
import {CreateMessageInput, UpdateMessageStatusInput} from "~~/server/model/message.model";
import {withTransaction} from "~~/server/db/postgres";
import {HttpError} from "~~/server/errors/HttpError";

export const createMessage = async (event: H3Event, body: CreateMessageInput) => {
    return withTransaction(
        async (client) => {
            const messageId = await repository.createMessage(client, body);
            if (!messageId) {
                throw new HttpError(500, 'MESSAGE_CREATION_FAILED', 'Failed to create message');
            }

            return sendSuccess(
                event,
                {message_id: messageId},
                "Message created successfully",
                "message_created",
                201
            )
        }
    )
}

export const getMessagesByCursor = async (event: H3Event, limit: number, status: 'unread' | 'read', cursor?: number) => {
    return withTransaction(
        async (client) => {
            const {messages, has_next} = await repository.getMessagesByCursor(client, limit, status, cursor);
            return sendSuccess(event, {
                data: messages,
                has_next: has_next
            }, "Messages retrieved successfully", "messages_retrieved");
        }
    )
}

export const getMessageById = async (event: H3Event, id: string) => {
    return withTransaction(
        async (client) => {
            const message = await repository.getMessageById(client, id);
            if (!message) {
                throw new HttpError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
            }
            return sendSuccess(event, message, "Message retrieved successfully", "message_retrieved");
        }
    )
}

export const updateMessageStatus = async (event: H3Event, data: UpdateMessageStatusInput) => {
    return withTransaction(
        async (client) => {
            const message = await repository.getMessageById(client, data.id);
            if (!message) {
                throw new HttpError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
            }

            const ok = await repository.updateMessageStatus(client, data.id, data);
            if (!ok) {
                throw new HttpError(500, 'MESSAGE_UPDATE_FAILED', 'Failed to update message status');
            }

            return sendSuccess(
                event,
                {message_id: data.id},
                "Message status updated successfully",
                "message_updated",
                200
            )
        }
    )
}

export const deleteMessage = async (event: H3Event, id: string) => {
    return withTransaction(
        async (client) => {
            const message = await repository.getMessageById(client, id);
            if (!message) {
                throw new HttpError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
            }

            const ok = await repository.deleteMessage(client, id);
            if (!ok) {
                throw new HttpError(500, 'MESSAGE_DELETION_FAILED', 'Failed to delete message');
            }

            return sendSuccess(
                event,
                {message_id: id},
                "Message deleted successfully",
                "message_deleted",
                200
            )
        }
    )
}

