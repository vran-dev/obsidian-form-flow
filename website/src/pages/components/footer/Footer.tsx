import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./Footer.module.css";

interface FooterLink {
	titleId: string;
	title: string;
	links: {
		labelId: string;
		label: string;
		href: string;
		external?: boolean;
	}[];
}

const footerLinks: FooterLink[] = [
	{
		titleId: "footer.product.title",
		title: "Product",
		links: [
			{
				labelId: "footer.product.changelog",
				label: "Changelog",
				href: "https://github.com/vran-dev/obsidian-form-flow/releases",
				external: true,
			},
		],
	},
	{
		titleId: "footer.resources.title",
		title: "Resources",
		links: [
			{
				labelId: "footer.resources.docs",
				label: "Documentation",
				href: "/docs",
			},
		],
	},
	{
		titleId: "footer.community.title",
		title: "Community",
		links: [
			{
				labelId: "footer.community.github",
				label: "GitHub",
				href: "https://github.com/vran-dev/obsidian-form-flow",
				external: true,
			},
			{
				labelId: "footer.community.discussions",
				label: "Discussions",
				href: "https://github.com/vran-dev/obsidian-form-flow/discussions",
				external: true,
			},
			{
				labelId: "footer.community.issues",
				label: "Report Issues",
				href: "https://github.com/vran-dev/obsidian-form-flow/issues",
				external: true,
			},
		],
	},
];

const socialLinks = [
	{
		name: "GitHub",
		href: "https://github.com/vran-dev/obsidian-form-flow",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
			</svg>
		),
	},
];

export default function Footer(): JSX.Element {
	return (
		<footer className={styles.footer}>
			<div className="container">
				<div className={styles.footerContent}>
					{/* Logo and Description */}
					<div className={styles.footerBrand}>
						<div className={styles.logoSection}>
							<Link href="/" className={styles.logoLink}>
								<span className={styles.logo}>Form Flow</span>
							</Link>
							<p className={styles.tagline}>
								<Translate id="footer.tagline">
									Visual form builder for Obsidian. Create,
									automate, and streamline your note-taking
									workflow.
								</Translate>
							</p>
						</div>

						{/* Social Links */}
						<div className={styles.socialLinks}>
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									className={styles.socialLink}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Links Grid */}
					<div className={styles.linksGrid}>
						{footerLinks.map((section) => (
							<div
								key={section.titleId}
								className={styles.linkSection}
							>
								<h3 className={styles.sectionTitle}>
									<Translate id={section.titleId}>
										{section.title}
									</Translate>
								</h3>
								<ul className={styles.linkList}>
									{section.links.map((link) => (
										<li
											key={link.labelId}
											className={styles.linkItem}
										>
											<Link
												href={link.href}
												className={styles.footerLink}
												{...(link.external && {
													target: "_blank",
													rel: "noopener noreferrer",
												})}
											>
												<Translate id={link.labelId}>
													{link.label}
												</Translate>
												{link.external && (
													<svg
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className={
															styles.externalIcon
														}
													>
														<path d="M7 17L17 7" />
														<path d="M7 7h10v10" />
													</svg>
												)}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
