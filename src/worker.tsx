import { defineApp, ErrorResponse } from "rwsdk/worker";
import { route, render, prefix, index } from "rwsdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import type { Session } from "./session/durableObject";
import { db, setupDb } from "./db";
import type { User } from "@prisma/client";
import { env } from "cloudflare:workers";
import { Chat } from "./app/pages/dashboard/chat/Chat";
import { Dashboard } from "./app/pages/dashboard/Dashboard";
import { New } from "./app/pages/dashboard/New";
import { Terms } from "./app/pages/legal/Terms";
import { Privacy } from "./app/pages/legal/Privacy";
export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
	session: Session | null;
	user: User | null;
};

const isAuthenticated = ({ ctx }: { ctx: AppContext }) => {
	if (!ctx.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: "/user/login" },
		});
	}
};

export default defineApp([
	setCommonHeaders(),
	async ({ ctx, request, headers }) => {
		await setupDb(env);
		setupSessionStore(env);

		try {
			ctx.session = await sessions.load(request);
		} catch (error) {
			if (error instanceof ErrorResponse && error.code === 401) {
				await sessions.remove(request, headers);
				headers.set("Location", "/user/login");

				return new Response(null, {
					status: 302,
					headers,
				});
			}

			throw error;
		}

		if (ctx.session?.userId) {
			ctx.user = await db.user.findUnique({
				where: {
					id: ctx.session.userId,
				},
			});
		}
	},

	render(Document, [
		index([isAuthenticated, Home]),
		prefix("/user", userRoutes),
		prefix("/dashboard", [
			route("/", [isAuthenticated, Dashboard]),
			route("/new", [isAuthenticated, New]),
			route("/chat/:id", [isAuthenticated, Chat]),
		]),
		route("/legal/privacy", [Privacy]),
		route("/legal/terms", [Terms]),
		route("/upload", async ({ request }) => {
			const formData = await request.formData();
			const file = formData.get("picture") as File;
			if (!file) {
				return new Response("No file uploaded", { status: 400 });
			}

			const fileKey = `storage/${file.name}`;
			const res = await env.R2.put(fileKey, file.stream(), {
				httpMetadata: {
					contentType: file.type,
				},
			});

			console.log("R2 Response", JSON.stringify(res, null, 2));

			return new Response(JSON.stringify({ url: res.key }), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}),
	]),
]);
