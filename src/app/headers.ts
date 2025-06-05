import type { RouteMiddleware } from "rwsdk/router";
import { IS_DEV } from "rwsdk/constants";

export const setCommonHeaders =
	(): RouteMiddleware =>
	({ headers, rw: { nonce } }) => {
		if (!IS_DEV) {
			// Forces browsers to always use HTTPS for a specified time period (2 years)
			headers.set(
				"Strict-Transport-Security",
				"max-age=63072000; includeSubDomains; preload",
			);
		}

		// Forces browser to use the declared content-type instead of trying to guess/sniff it
		headers.set("X-Content-Type-Options", "nosniff");

		// Stops browsers from sending the referring webpage URL in HTTP headers
		headers.set("Referrer-Policy", "no-referrer");

		// Explicitly disables access to specific browser features/APIs
		headers.set(
			"Permissions-Policy",
			"geolocation=(), microphone=(), camera=()",
		);

		// Defines trusted sources for content loading and script execution:
		headers.set(
			"Content-Security-Policy",
			`default-src 'self'; script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://challenges.cloudflare.com; img-src 'self' blob: https://pub-a61e40a1c173478f9ec99627cd03a855.r2.dev; object-src 'none';`,
		);
	};
