import { MainLayout } from "@/app/layouts/MainLayout";
import { ChatBox } from "@/app/components/ChatBox";
import type { RequestInfo } from "rwsdk/worker";

/**
 * Chat page component displaying a chat interface for a specific chat
 * @param params - The request parameters
 * @returns Chat page JSX
 */
const Chat = async ({ params }: RequestInfo) => {
	console.log(params);
	return (
		<MainLayout>
			<div className="px-page-side flex justify-between items-center">
				<div className="w-full max-w-screen-xl">
					<div className="px-page-side flex justify-between items-center">
						<h1 className="page-title">Muse Chat</h1>
					</div>
					<ChatBox chatId={params.id} />
				</div>
			</div>
		</MainLayout>
	);
};

export { Chat };
