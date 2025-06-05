import { link } from "../shared/links";
import { Avatar, AvatarFallback } from "./ui/avatar";

/**
 * The header of the app.
 * @returns The header of the app.
 */
const Header = () => {
	return (
		<header className="py-5 px-page-side h-20 flex justify-between items-center border-b-1 border-border mb-12">
			<div className="flex items-center gap-8">
				<a
					href={link("/")}
					className="flex items-center gap-3 font-display font-bold text-3xl"
				>
					<img
						src="/images/image.png"
						alt="Meow Muse"
						className="h-16 w-auto object-contain align-middle"
					/>
					<span>Meow Muse</span>
				</a>
				<nav>
					<ul>
						<li>
							<a href={link("/dashboard")}>Dashboard</a>
						</li>
					</ul>
				</nav>
			</div>

			{/* right side */}
			<div>
				<nav>
					<ul className="flex items-center gap-7">
						<li>
							<a href={link("/settings")}>Settings</a>
						</li>
						<li>
							<a href={link("/user/logout")}>Logout</a>
						</li>
						<li>
							<Avatar>
								<AvatarFallback>R</AvatarFallback>
							</Avatar>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export { Header };
