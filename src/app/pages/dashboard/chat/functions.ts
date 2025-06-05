"use server";

import { db } from "@/db";
import type { Sender } from "@prisma/client";

/**
 * Get chat by id - used to populate all data for a chat
 * @param id - chat id
 * @returns chat
 */
export async function getChatById({ id }: { id: string }) {
	if (!id) throw new Error("Chat ID is required");
	const chat = await db.chat.findUnique({
		where: { id },
		include: {
			user: true,
			cat: true,
			messages: {
				orderBy: {
					timestamp: "asc",
				},
			},
		},
	});
	return chat;
}

// get chat by cat id
export async function getChatByCatId({ catId }: { catId: string }) {
	const chat = await db.chat.findFirst({
		where: {
			catId,
		},
	});
	return chat;
}

/**
 * Get all chats for a user
 * @param userId - user id
 * @returns chats
 */
export async function getAllChatsForUser({ userId }: { userId: string }) {
	const chats = await db.chat.findMany({
		where: {
			userId,
		},
		include: {
			cat: true,
		},
	});
	return chats;
}

/**
 * Create a new chat message
 * @param id - chat id
 * @param sender - sender
 * @param content - message content
 */
export async function createChatMessage({
	id,
	sender,
	content,
}: { id: string; sender: Sender; content: string }) {
	console.log("Creating chat message", id, sender, content);
	if (!id || !sender || !content) {
		throw new Error("Invalid message data");
	}
	const chat = await db.chat.findUnique({ where: { id } });
	if (!chat) {
		throw new Error("Chat not found for the given chatId");
	}
	await db.chatMessage.create({
		data: {
			sender,
			content,
			chat: {
				connect: {
					id: id,
				},
			},
		},
	});
}
