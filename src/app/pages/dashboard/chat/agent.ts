"use server";
import type { Cat } from "@prisma/client";

import { db } from "@/db";
import { env } from "cloudflare:workers";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

const qdrant = new QdrantClient({
	url: env.QDRANT_URL,
	apiKey: env.QDRANT_API_KEY,
});

// TODO: Add a system prompt that is more specific to the user's cat.
export const createSystemPrompt = (
	catInfo: Pick<
		Cat,
		"name" | "age" | "weight" | "gender" | "breed" | "notes" | "weightStatus"
	>,
	context: string,
	chatMessages: string,
) => {
	return `
	You are Muse, a helpful assistant for cat owners. Your demeanor is friendly and professional.

	Only answer questions related to cat health or behavior. Your answers should be informative, helpful and concise.

	The following is information about the cat:
	- Name: ${catInfo.name}
	- Age: ${catInfo.age}
	- Weight: ${catInfo.weight}
	- Weight Status: ${catInfo.weightStatus}
	- Gender: ${catInfo.gender}
	- Breed: ${catInfo.breed}
	- Notes: ${catInfo.notes}

	When answering questions, please take into account the provided context about the cat's health and behavior. If the question is not directly related to the cat's health, behavior, or the provided context, please respond with 'Sorry, I don't know the answer to that question.'

	If you're unsure or don't have enough information to answer a question, please respond with 'I don't have enough information to answer that question.'

	Context: ${context}
	Past messages: ${chatMessages}

	IMPORTANT: Do not include any text like 'assistant<|header_end|>' in your response.
`;
};

export const respondWithAgent = async (
	chatId: string,
	userInput: string,
	catInfo: Pick<
		Cat,
		"name" | "age" | "weight" | "gender" | "breed" | "notes" | "weightStatus"
	>,
) => {
	// OpenAI embeddings

	const embeddings = await openai.embeddings
		.create({
			model: "text-embedding-ada-002",
			input: userInput,
		})
		.then((res) => res.data[0].embedding);

	// Qdrant vector store is used to search for relevant context.

	const searchResults = await qdrant.search("cat_knowledge", {
		vector: embeddings,
		limit: 5,
		score_threshold: 0.75,
	});

	// Get the previous messages for the chat.
	const chatMessages = await db.chatMessage.findMany({
		where: {
			chatId,
		},
	});

	// Get the context.
	const context = searchResults.map((p) => p.payload?.text ?? "").join("\n\n");

	// Create the prompt for the agent.
	const prompt = createSystemPrompt(
		catInfo,
		context,
		chatMessages.map((m) => `${m.sender}: ${m.content}`).join("\n"),
	);
	const response = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		prompt,
		stream: true,
	});
	return response as unknown as ReadableStream;
};
