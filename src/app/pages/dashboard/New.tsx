import { MainLayout } from "@/app/layouts/MainLayout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { CatForm } from "@/app/components/CatForm";

/**
 * New cat page component displaying a form to add a new cat
 * @returns New cat page JSX
 */
export const New = () => {
	return (
		<MainLayout>
			<div className="mb-12 -mt-7 pl-[120px]">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>New</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="mx-page-side pb-6 mb-8 border-b-1 border-border">
				<h1 className="page-title">New Cat</h1>
				<p className="page-description">Add a new cat</p>
			</div>
            <CatForm />
		</MainLayout>
	);
};
