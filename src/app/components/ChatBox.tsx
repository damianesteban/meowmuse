"use client";

import { useState, useRef, useEffect } from "react";
import {
	getChatById,
	createChatMessage,
} from "@/app/pages/dashboard/chat/functions";
import { consumeEventStream } from "rwsdk/client";
import type { Cat, Sender } from "@prisma/client";
import Markdown from "markdown-to-jsx";
import { Card, CardContent } from "./ui/card";
import { respondWithAgent } from "../pages/dashboard/chat/agent";
import { formatVaccinationStatus } from "./utils";

interface ChatBoxProps {
	chatId: string;
}

/**
 * ChatBox component displaying a chat interface for a specific chat
 * @param chatId - The ID of the chat
 * @returns ChatBox component JSX
 */
export function ChatBox({ chatId }: ChatBoxProps) {
	type ChatMessage = { sender: Sender; content: string };
	const [messages, setMessages] = useState<
		{ role: "user" | "assistant"; content: string }[]
	>([]);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	/**
	 * NOTE: Not currently in use. This is to set the metadata from the RAG retrieval.
	 */
	const [resultsData, setResultsData] = useState<
		{
			source: object;
			type: object;
			file?: object;
			title?: object;
		}[]
	>([]);
	const [catInfo, setCatInfo] = useState<Cat | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Load chat messages on mount
	// TODO: Add a loading state for the chat.
	// TODO: Clean up state management.
	useEffect(() => {
		let ignore = false;
		async function loadChat() {
			setIsInitialLoading(true);
			const chat = await getChatById({ id: chatId });
			console.log(chat?.cat);
			console.log(chat?.messages);
			if (!ignore && chat?.messages) {
				setMessages(
					chat.messages.map((m: ChatMessage) => ({
						role: m.sender === "user" ? "user" : "assistant",
						content: m.content,
					})),
				);
			}
			if (!ignore && chat?.cat) {
				setCatInfo({
					...chat.cat,
				});
			}
			// Create a welcome message if the chat is empty.
			if (!ignore && chat?.messages.length === 0) {
				createChatMessage({
					id: chatId,
					sender: "assistant",
					content:
						"Hello! I'm Muse! I'm here to help you take care of your cat. How can I help you today?",
				});
			}
			setIsInitialLoading(false);
		}
		loadChat();
		return () => {
			ignore = true;
		};
	}, [chatId]);

	// Auto-scroll to bottom when messages change
	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to scroll on messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	/**
	 * Handle the form submission.
	 * @param e - The form event.
	 * @returns void
	 */
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// If the message is empty, do nothing.
		if (!message.trim()) return;
		setIsLoading(true);
		// Add both user message and assistant placeholder in one update
		setMessages((prev) => [
			...prev,
			{ role: "user", content: message },
			{ role: "assistant", content: "" },
		]);
		// Persist user message to backend
		await createChatMessage({
			id: chatId,
			sender: "user",
			content: message,
		});
		setMessage("");
		// TODO: Refactor this to use a more functional approach.
		let aiMessage = "";
		// Use the server action sendMessage to stream the AI response
		const response = await respondWithAgent(
			chatId,
			message,
			catInfo as Pick<
				Cat,
				| "name"
				| "age"
				| "weight"
				| "gender"
				| "breed"
				| "notes"
				| "weightStatus"
			>,
		);

		// Pipe the response to the client.
		// This is a bit ugly. I might use a library like the Vercel AI SDK to handle this,
		// but the RedwoodJS SDK doesn't support it yet, and maybe it isn't worth it.
		response.pipeTo(
			consumeEventStream({
				onChunk: async (event) => {
					setMessages((prev) => {
						if (event.data === "[DONE]") {
							setIsLoading(false);
							// Persist assistant message when complete
							createChatMessage({
								id: chatId,
								sender: "assistant",
								content: aiMessage,
							});
							return prev;
						}
						const parsed = JSON.parse(event.data);
						const chunk = parsed.response;
						if (chunk !== undefined && chunk !== null) {
							aiMessage += chunk;
						}
						const updated = [...prev];
						updated[updated.length - 1] = {
							role: "assistant",
							content: aiMessage,
						};
						return updated;
					});
				},
			}),
		);
	};

	return (
		<div className="flex h-[70vh] w-full border rounded-lg bg-white shadow">
			<aside className="w-60 bg-gray-50 border-r p-4 flex flex-col justify-between">
				<Card>
					<CardContent>
						{catInfo?.imageKey ? (
							<div className="flex justify-center mb-4">
								<img
									src={catInfo.imageKey ?? "/images/cat-placeholder.jpeg"}
									alt={catInfo.name ? `${catInfo.name}'s photo` : "Cat photo"}
									className="w-24 h-24 object-cover rounded-full border"
								/>
							</div>
						) : (
							<div className="flex justify-center mb-4">
								<div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full border text-gray-400 text-3xl">
									🐱
								</div>
							</div>
						)}
						<div className="mb-2 text-xs">
							<span className="font-semibold">Name:</span>{" "}
							<i>{catInfo?.name || "—"}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Age:</span> <i>{catInfo?.age}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Weight:</span>{" "}
							<i>{catInfo?.weight || "—"}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Gender:</span>{" "}
							<i>{catInfo?.gender || "—"}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Breed:</span>{" "}
							<i>{catInfo?.breed || "—"}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Neutered/Spayed:</span>{" "}
							<i>{catInfo?.neuterOrSpayed ? "Yes" : "No"}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Activity Level:</span>{" "}
							<i>{catInfo?.activityLevel || "—"}</i>
						</div>
						<div className="mb-2 text-xs">
							<span className="font-semibold">Vaccination Status:</span>{" "}
							<i>
								{formatVaccinationStatus(
									catInfo?.vaccinationStatus ?? "upToDate",
								) || "—"}
							</i>
						</div>
						<div className="text-xs">
							<span className="font-semibold">Notes:</span>{" "}
							<i>{catInfo?.notes || "—"}</i>
						</div>
					</CardContent>
				</Card>
				<div className="text-xs text-gray-400 mt-4">
					Meow Muse &copy; {new Date().getFullYear()}
				</div>
			</aside>
			<main className="flex-1 flex flex-col">
				<div className="flex-1 overflow-y-auto p-4 space-y-2">
					{isInitialLoading ? (
						<div className="text-center text-gray-400">Loading chat...</div>
					) : (
						messages.map((msg, i) => (
							<div
								key={`${msg.role}-${msg.content.slice(0, 16)}-${i}`}
								className={
									msg.role === "user" ? "text-right" : "text-left black"
								}
							>
								<span
									className={`${
										msg.role === "user"
											? "inline-block px-3 py-2 rounded bg-gray-100 max-w-[60%]"
											: "inline-block px-3 py-2 rounded bg-amber-100 max-w-[60%]"
									} text-xs`}
								>
									<Markdown>{msg.content}</Markdown>
								</span>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
				<form onSubmit={onSubmit} className="flex border-t p-2 bg-gray-50">
					<input
						type="text"
						value={message}
						placeholder="Type a message..."
						onChange={(e) => setMessage(e.target.value)}
						className="flex-1 px-3 py-2 border rounded mr-2 text-xs"
						disabled={isLoading || isInitialLoading}
					/>
					<button
						type="submit"
						disabled={message.length === 0 || isLoading || isInitialLoading}
						className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
					>
						{isLoading ? "Sending..." : "Send"}
					</button>
				</form>
			</main>
		</div>
	);
}
