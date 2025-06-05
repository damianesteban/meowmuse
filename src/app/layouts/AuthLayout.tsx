/**
 * AuthLayout component displaying a layout for authentication pages
 * @param children - The child components to render
 * @returns AuthLayout component JSX
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="page-wrapper">
			<div className="grid grid-cols-2 page">
				<div className="relative center bg-[url('/images/bg.png')] bg-repeat rounded-l-xl">
					<div className="-top-[100px] relative">
						<img src="/images/image.png" alt="Meow Muse" className="mx-auto" />
						<div className="text-5xl text-white font-bold">Meow Muse</div>
					</div>
					<div className="text-white text-sm absolute bottom-0 left-0 right-0 p-10">
						“Your AI-powered cat health assistant.”
					</div>
				</div>
				<div className="center bg-white rounded-r-xl relative">
					<div>{children}</div>
				</div>
			</div>
		</div>
	);
};

export { AuthLayout };
