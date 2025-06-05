"use server";

import { db } from "@/db";
import { createChatMessage } from "./chat/functions";
import type { ActivityLevel, Gender, WeightStatus, VaccinationStatus } from "@prisma/client";
import { requestInfo } from "rwsdk/worker";

/**
 * Get all cats with their chats
 * @returns cats with chats
 */
export async function getCatsWithChats() {
	const cats = await db.cat.findMany({
		include: {
			chat: true,
		},
	});
	return cats;
}

/**
 * Create a new chat
 * @param userId - user id
 * @param title - chat title
 * @param catIds - cat ids
 * @returns chat
 */
export async function createCatAndChat(formData: FormData) {
	if (!formData) {
		throw new Error("Invalid message data");
	}

	const imageKey = await uploadFile(formData);
	const { ctx } = requestInfo;

	const cat = await db.cat.create({
		data: {
			name: formData.get("catName") as string,
			breed: formData.get("catBreed") as string,
			age: Number.parseInt(formData.get("catAge") as string),
			weight: Number.parseFloat(formData.get("catWeight") as string),
			gender: formData.get("gender") as unknown as Gender,
			weightStatus: formData.get("weightStatus") as WeightStatus,
			notes: formData.get("catNotes") as string,
			neuterOrSpayed: true,
			activityLevel: formData.get("activityLevel") as ActivityLevel,
			vaccinationStatus: formData.get("vaccinationStatus") as VaccinationStatus,
			imageKey,
			user: {
				connect: {
					id: ctx.session?.userId ?? "",
				},
			},
		},
	});

	const chat = await db.chat.create({
		data: {
			userId: ctx.session?.userId ?? "",
			title: `Chat about ${cat.name}`,
			catId: cat.id,
		},
	});

	const firstMessage = await createChatMessage({
		id: chat.id,
		sender: "assistant",
		content: `Hello! I'm Muse! I'm here to help you take care of ${cat.name}. How can I help you today?`,
	});

	return { cat, chat, firstMessage };
}

/**
 * Upload a file to the R2 bucket
 * NOTE: Not currently used
 * @param file - The file to upload
 * @returns The URL of the uploaded file
 */
export async function uploadFile(formData: FormData) {
	const response = await fetch("/upload", {
		method: "POST",
		body: formData,
	});
	if (!response.ok) {
		throw new Error("Failed to upload file");
	}
	const res = await response.json() as { url: string };
	return res.url;
}