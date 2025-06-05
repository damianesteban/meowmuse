"use client";
import type { RequestInfo } from "rwsdk/worker";
import { link } from "@/app/shared/links";
import { Redirect } from "@/app/components/Redirect";

/**
 * Home page component displaying a welcome message and a link to the dashboard
 * @param ctx - The request context
 * @returns Home page JSX
 */
export function Home({ ctx }: RequestInfo) {
	if (ctx.user?.username) {
		return <Redirect to={link("/dashboard")} />;
	}
	return (
		<div>
			<p>You are not logged in</p>
		</div>
	);
}
