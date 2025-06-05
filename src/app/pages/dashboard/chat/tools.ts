import type { Cat, WeightStatus } from "@prisma/client";

/**
 * NOTE: This tool is not currently in use - I had some issues with the agent not being able to call it.
 */

/**
 * Calorie multipliers for different cat weight statuses and ages
 */
const calorieMultipliers = {
	lessThanFourMonths: 2.5,
	lessThanOneYear: 2.0,
	underWeight: 1.5,
	overWeight: 0.8,
	default: 1.0,
} as const;

/**
 * Determine the calorie multiplier for a cat based on their weight status and age
 * @param weightStatus - The weight status of the cat
 * @param age - The age of the cat
 * @returns The calorie multiplier
 */
const determineCalorieMultiplier = (
	weightStatus: WeightStatus,
	age: number,
) => {
	if (age < 1 && age > 0.4) {
		return calorieMultipliers.lessThanOneYear;
	}
	if (age < 0.4) {
		return calorieMultipliers.lessThanFourMonths;
	}
	if (weightStatus === "underWeight") {
		return calorieMultipliers.underWeight;
	}
	if (weightStatus === "overWeight") {
		return calorieMultipliers.overWeight;
	}
	return calorieMultipliers.default;
};

// Calculate the calories by weight and multiplier
const caloriesPerDayByWeight = (weight: number, multiplier: number) =>
	Math.round(weight * (multiplier * 20));

/**
 * Calculate the calories per day for a cat based on their weight, age, and weight status
 * @param cat - The cat to calculate the calories for
 * @returns The calories per day
 */
export const calculateCaloriesPerDay = (
	cat: Pick<Cat, "weight" | "age" | "weightStatus">,
) => {
	const multiplier = determineCalorieMultiplier(cat.weightStatus, cat.age);
	return caloriesPerDayByWeight(cat.weight, multiplier);
};
