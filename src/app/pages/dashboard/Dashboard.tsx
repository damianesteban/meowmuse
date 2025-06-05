import { MainLayout } from "@/app/layouts/MainLayout";
import { Button } from "@/app/components/ui/button";
import { link } from "@/app/shared/links";
import { CatsTable } from "@/app/components/CatsTable";
import { getCatsWithChats } from "./functions";

/**
 * Dashboard page component displaying a list of cats with their chats
 * @returns Dashboard page JSX
 */
const Dashboard = async () => {
	// TODO: Add a loading state
	const cats = await getCatsWithChats();

	return (
		<MainLayout>
			<>
				<div className="px-page-side flex justify-between items-center">
					<h1 className="page-title">Cats</h1>
					<div>
						<Button asChild>
							<a href={link("/dashboard/new")}>Add Cat</a>
						</Button>
					</div>
				</div>
				<CatsTable cats={cats} />
			</>
		</MainLayout>
	);
};

export { Dashboard };
