"use client";

import { useEffect } from "react";

/**
 * Redirects the user to the specified URL on mount.
 * @param to - The destination URL to redirect to.
 */
export function Redirect({ to }: { to: string }): null {
	useEffect(() => {
		window.location.href = to;
	}, [to]);
	return null;
}
