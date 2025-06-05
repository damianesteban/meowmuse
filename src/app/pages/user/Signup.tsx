"use client";

import { useState, useTransition } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import {
	finishPasskeyRegistration,
	startPasskeyRegistration,
} from "./functions";
import { Button } from "@/app/components/ui/button";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { Alert, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { link } from "@/app/shared/links";

/**
 * Signup page component displaying signup form with passkey registration functionality
 * @returns Signup page JSX
 */
export function SignupPage() {
	const [username, setUsername] = useState("");
	const [result, setResult] = useState("");
	const [isPending, startTransition] = useTransition();

	const passkeyRegister = async () => {
		const options = await startPasskeyRegistration(username);
		const registration = await startRegistration({ optionsJSON: options });

		const success = await finishPasskeyRegistration(username, registration);

		if (!success) {
			setResult("Registration failed");
		} else {
			setResult("Registration successful!");
		}
	};

	const handlePerformPasskeyRegister = () => {
		startTransition(() => void passkeyRegister());
	};

	return (
		<AuthLayout>
			<div className="absolute top-0 right-0 p-10">
				<a
					href={link("/user/login")}
					className="font-display font-bold text-black text-sm underline underline-offset-8 hover:decoration-primary"
				>
					Login
				</a>
			</div>

			<div className="auth-form max-w-[400px] w-full px-10">
				<h1 className="page-title text-center">Create an Account</h1>
				<p className="py-6">Enter a username to setup an account.</p>

				{result && (
					<Alert variant="destructive" className="mb-5">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>{result}</AlertTitle>
					</Alert>
				)}

				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
				/>
				<Button
					onClick={handlePerformPasskeyRegister}
					disabled={isPending}
					className="font-display w-full mb-6"
				>
					{isPending ? <>...</> : "Register with Passkey"}
				</Button>

				<p>
					By clicking continue, you agree to our 
					<a href={link("/legal/terms")}>Terms of Service</a> and 
					<a href={link("/legal/privacy")}>Privacy Policy</a>.
				</p>
			</div>
		</AuthLayout>
	);
}
