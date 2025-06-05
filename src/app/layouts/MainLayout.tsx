import { Header } from "../components/Header";

/**
 * MainLayout component displaying a layout for the main pages
 * @param children - The child components to render
 * @returns MainLayout component JSX
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="page-wrapper">
			<main className="page bg-white">
				<Header />
				{children}
			</main>
		</div>
	);
};

export { MainLayout };
