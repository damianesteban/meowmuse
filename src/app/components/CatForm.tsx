"use client";

import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { createCatAndChat } from "../pages/dashboard/functions";
import { useFormState, useFormStatus } from "react-dom";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type CatFormState = {
	message: string | null;
	errors: Record<string, string>;
};

const initialState: CatFormState = {
	message: null,
	errors: {},
};

/**
 * Handles the form submission.
 * @param prevState - The previous state of the form.
 * @param formData - The form data.
 * @returns The new state of the form.
 */
async function handleSubmit(
	prevState: CatFormState,
	formData: FormData,
): Promise<CatFormState> {
	try {
		await createCatAndChat(formData);
		return { message: "Cat created successfully!", errors: {} };
	} catch (err: unknown) {
		return {
			message: null,
			errors: { general: err instanceof Error ? err.message : "Unknown error" },
		};
	}
}

/**
 * A button that is used to submit the form.
 * @returns A button that is used to submit the form.
 */
function SubmitButton() {
	const { pending, action, data } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Creating..." : "Create"}
		</Button>
	);
}

/**
 * The form for creating a new cat.
 * @returns The form for creating a new cat.
 */
const CatForm = () => {
	const [preview, setPreview] = useState<string | null>(null);

	// NOTE: Not currently in use.
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [formState, formAction] = useFormState(handleSubmit, initialState);

	useEffect(() => {
		// Clean up the object URL when component unmounts or preview changes
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	// NOTE: Not currently in use.
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setPreview(url);
		} else {
			setPreview(null);
		}
	};

	return (
		<form action={formAction} encType="multipart/form-data">
			<div className="grid grid-cols-2 gap-[200px] px-page-side mb-[75px]">
				{/* left side */}
				<div>
					<div>
						<h2>About your cat</h2>
						<div className="field">
							<label htmlFor="catName">Cat Name</label>
							<p className="input-description">What's your cat's name?</p>
							<input type="text" id="catName" name="catName" />
						</div>
						<div className="field">
							<label htmlFor="catBreed">Breed</label>
							<p className="input-description">What's your cat's breed?</p>
							<input type="text" id="catBreed" name="catBreed" />
						</div>
						<div className="field">
							<label htmlFor="catNotes">Notes</label>
							<p className="input-description">Add some notes about your cat</p>
							<textarea id="catNotes" name="catNotes" />
						</div>
						<div className="field">
							<label htmlFor="catBirthday">Cat's Age</label>
							<p className="input-description">How old is your cat?</p>
							<div>
								<input type="number" id="catAge" name="catAge" />
							</div>
						</div>
						<div className="field">
							<SubmitButton />
						</div>
						{formState.message && (
							<div className="text-green-600 mt-2">{formState.message}</div>
						)}
						{formState.errors.general && (
							<div className="text-red-600 mt-2">
								{formState.errors.general}
							</div>
						)}
					</div>
				</div>

				{/* right side */}
				<div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="picture">Picture</Label>
						<Input
							id="picture"
							type="file"
							name="picture"
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
						{preview && (
							<div className="mt-4">
								<img
									src={preview}
									alt="Preview"
									className="max-w-xs max-h-48 rounded border"
								/>
							</div>
						)}
					</div>
					<div className="field">
						<label htmlFor="gender">Gender</label>
						<p className="input-description">What's your cat's gender?</p>
						<Select name="gender">
							<SelectTrigger>
								<SelectValue placeholder="Male" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="male">Male</SelectItem>
								<SelectItem value="female">Female</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="field">
						<label htmlFor="catWeight">Weight (lbs)</label>
						<p className="input-description">What's your cat's weight?</p>
						<input type="number" id="catWeight" name="catWeight" />
					</div>
					<div className="field">
						<label htmlFor="weightStatus">Weight Status</label>
						<p className="input-description">
							What's your cat's weight status?
						</p>
						<Select name="weightStatus">
							<SelectTrigger>
								<SelectValue placeholder="Ideal Weight" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="underWeight">Under Weight</SelectItem>
								<SelectItem value="overWeight">Over Weight</SelectItem>
								<SelectItem value="idealWeight">Ideal Weight</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="field">
						<label htmlFor="neuteredOrSpayed">Neutered/Spayed</label>
						<p className="input-description">Is your cat neutered or spayed?</p>
						<Select name="neuteredOrSpayed">
							<SelectTrigger>
								<SelectValue placeholder="Yes" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">Yes</SelectItem>
								<SelectItem value="false">No</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="field">
						<label htmlFor="activityLevel">Activity Level</label>
						<p className="input-description">
							What's your cat's activity level?
						</p>
						<Select name="activityLevel">
							<SelectTrigger>
								<SelectValue placeholder="Medium" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sedentary">Sedentary</SelectItem>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="field">
						<label htmlFor="vaccinationStatus">Vaccination Status</label>
						<p className="input-description">
							What's your cat's vaccination status?
						</p>
						<Select name="vaccinationStatus">
							<SelectTrigger>
								<SelectValue placeholder="Unknown" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="unknown">Unknown</SelectItem>
								<SelectItem value="upToDate">Up to date</SelectItem>
								<SelectItem value="due">Due</SelectItem>
								<SelectItem value="overdue">Overdue</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</form>
	);
};

export { CatForm };
