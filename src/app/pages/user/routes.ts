import { route } from "rwsdk/router";
import { Login } from "./Login";
import { sessions } from "@/session/store";
import { SignupPage } from "./Signup";

export const userRoutes = [
	route("/login", [Login]),
	route("/signup", [SignupPage]),
	route("/logout", async ({ request }) => {
		const headers = new Headers();
		await sessions.remove(request, headers);
		headers.set("Location", "/");

		return new Response(null, {
			status: 302,
			headers,
		});
	}),
];
