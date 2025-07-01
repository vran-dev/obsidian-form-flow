import Translate from "@docusaurus/Translate";
import styles from "./Features.module.css";

const features = [
	{
		icon: "🚄",
		titleId: "features.noCode.title",
		descriptionId: "features.noCode.description",
		background:
			"linear-gradient(30deg, rgba(var(--color-blue-rgb), 0.05) 0%, rgba(var(--color-blue-rgb), 0.5) 50%, rgba(var(--color-blue-rgb), 0.05) 90%)",
	},
	{
		icon: "🚀",
		titleId: "features.efficiency.title",
		descriptionId: "features.efficiency.description",
		background:
			"linear-gradient(30deg, rgba(var(--color-red-rgb), 0.05) 0%, rgba(var(--color-red-rgb), 0.5) 50%, rgba(var(--color-red-rgb), 0.05) 90%)",
	},
	{
		icon: "🌐",
		titleId: "features.community.title",
		descriptionId: "features.community.description",
		background:
			"linear-gradient(30deg, rgba(var(--color-purple-rgb), 0.05) 0%, rgba(var(--color-purple-rgb), 0.5) 50%, rgba(var(--color-purple-rgb), 0.05) 90%)",
	},
	{
		icon: "🛫",
		titleId: "features.thinkBeyond.title",
		descriptionId: "features.thinkBeyond.description",
		background:
			"linear-gradient(30deg, rgba(var(--color-green-rgb), 0.05) 0%, rgba(var(--color-green-rgb), 0.5) 50%, rgba(var(--color-green-rgb), 0.05) 90%)",
	},
	{
		icon: "⭐️",
		titleId: "features.openSource.title",
		descriptionId: "features.openSource.description",
		background:
			"linear-gradient(30deg, rgba(var(--color-yellow-rgb), 0.05) 0%, rgba(var(--color-yellow-rgb), 0.5) 50%, rgba(var(--color-yellow-rgb), 0.05) 90%)",
		link: {
			href: "https://github.com/vran-dev/obsidian-form-flow",
			label: "GitHub →",
		},
	},
];

export default function Features(): JSX.Element {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className={styles.sectionHeader}>
					<h2 className={styles.title}>
						<Translate id="features.title"></Translate>
					</h2>
					<p className={styles.subtitle}>
						<Translate id="features.subtitle"></Translate>
					</p>
				</div>
			</div>

			<div className={styles.featuresGrid}>
				{features.map((feature, index) => (
					<div key={index} className={styles.feature}>
						<span className={styles.featureIcon}>
							{feature.icon}
						</span>
						<div className={styles.featureContent}>
							<h3 className={styles.featureTitle}>
								<Translate id={feature.titleId}></Translate>
							</h3>
							<p className={styles.featureDescription}>
								<Translate
									id={feature.descriptionId}
								></Translate>
							</p>
							{feature.link && (
								<a
									className={styles.featureLink}
									href={feature.link.href}
									target="_blank"
									rel="noopener noreferrer"
								>
									{feature.link.label}
								</a>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
