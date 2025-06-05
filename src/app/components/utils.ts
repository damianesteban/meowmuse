import type { VaccinationStatus } from "@prisma/client";

/**
 * Truncate a string to a maximum length
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the truncated text
 * @returns The truncated text
 */
export function truncate(text?: string | null, maxLength = 50): string {
	if (!text) return "";
	return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * Format the vaccination status.
 * @param status - The vaccination status.
 * @returns The formatted vaccination status.
 */
export function formatVaccinationStatus(status: VaccinationStatus): string {
	switch (status) {
		case "upToDate":
			return "Up to date";
		case "overdue":
			return "Overdue";
		case "due":
			return "Due for next vaccine";
		default:
			return "Unknown";
	}
}