"use client";
import type { getCatsWithChats } from "../pages/dashboard/functions";
import { link } from "../shared/links";
import { Button } from "./ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { formatVaccinationStatus, truncate } from "./utils";

type CatWithChat = Awaited<ReturnType<typeof getCatsWithChats>>[number];

/**
 * The table of cats.
 * @param cats - The cats to display.
 * @returns The table of cats.
 */
const CatsTable = ({ cats }: { cats: CatWithChat[] }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="font-bold">Name</TableHead>
					<TableHead className="font-bold">Breed</TableHead>
					<TableHead className="font-bold">Age</TableHead>
					<TableHead className="font-bold">Gender</TableHead>
					<TableHead className="font-bold">Weight</TableHead>
					<TableHead className="font-bold">Neutered/Spayed</TableHead>
					<TableHead className="font-bold">Activity Level</TableHead>
					<TableHead className="font-bold">Vaccination Status</TableHead>
					<TableHead className="font-bold">Notes</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{cats.map((cat) => (
					<TableRow key={cat.id}>
						<TableCell>{cat.name}</TableCell>
						<TableCell>{cat.breed}</TableCell>
						<TableCell>
							{cat.age}
						</TableCell>
						<TableCell>{cat.gender}</TableCell>
						<TableCell>{cat.weight}</TableCell>
						<TableCell>{cat.neuterOrSpayed ? "Yes" : "No"}</TableCell>
						<TableCell>{cat.activityLevel}</TableCell>
						<TableCell>{formatVaccinationStatus(cat.vaccinationStatus)}</TableCell>
						<TableCell>{truncate(cat.notes)}</TableCell>
						<TableCell>
							<Button>
								<a href={link("/dashboard/chat/:id", { id: cat.chat?.id ?? "" })}>View</a>
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export { CatsTable };
