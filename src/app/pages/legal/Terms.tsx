
"use client";

import { MainLayout } from "@/app/layouts/MainLayout";

/**
 * Terms and Conditions page component displaying legal terms with placeholder text
 * @returns Terms and Conditions page JSX
 */
export function Terms() {
	return (
		<MainLayout>
			<div className="px-page-side max-w-4xl mx-auto py-12">
				<h1 className="page-title mb-8">Terms and Conditions</h1>

				<div className="prose prose-slate">
					<h2>1. Introduction</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</p>

					<h2>2. Use License</h2>
					<p>
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>

					<h2>3. Disclaimer</h2>
					<p>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
					</p>

					<h2>4. Limitations</h2>
					<p>
						Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
					</p>

					<h2>5. Revisions and Errata</h2>
					<p>
						At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
					</p>

					<h2>6. Links</h2>
					<p>
						Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
					</p>

					<h2>7. Terms of Use Modifications</h2>
					<p>
						Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
					</p>
				</div>
			</div>
		</MainLayout>
	);
}
