import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./Hero.module.css";
import DemoForm from "./dmeo-form/DemoForm";
import React from "react";
import { DemoConfig } from "../../../types/DemoConfig";

export default function Hero(): JSX.Element {
	const [activeIndex, setActiveIndex] = React.useState(0);

	const demos: DemoConfig[] = [
		{
			id: "journalTemplate",
			icon: "🗓",
			titleId: "hero.demo.journalTemplate.title",
			descriptionId: "hero.demo.journalTemplate.description",
			fields: [
				{
					label: "Date",
					value: new Date().toISOString().split("T")[0],
					type: "text",
				},
				{ label: "Weather", value: "☀️ Sunny 26°C", type: "text" },
				{
					label: "Template",
					value: `## 📅 Daily Journal

> Reflect on your day, capture thoughts, and plan for tomorrow.

## 📖 Reflection

> What did I learn today?



          `,
					type: "textarea",
				},
			],
			action: "Create Journal",
		},
		{
			id: "projectSetup",
			icon: "🚀",
			titleId: "hero.demo.projectSetup.title",
			descriptionId: "hero.demo.projectSetup.description",
			fields: [
				{
					label: "Project Name",
					value: "Research Dashboard",
					type: "text",
				},
				{ label: "Status", value: "TODO", type: "select" },
				{
					label: "Area",
					value: "[[Research]]",
					type: "text",
				},
				{
					label: "Create Time",
					value: new Date().toLocaleDateString(),
					type: "text",
				},
			],
			action: "Generate Project",
		},

		{
			id: "quickCapture",
			icon: "💡",
			titleId: "hero.demo.quickCapture.title",
			descriptionId: "hero.demo.quickCapture.description",
			fields: [
				{
					label: "Insipiration",
					value: "what inspires you?",
					type: "textarea",
				},
				{
					label: "Type",
					value: "Callout",
					type: "radio",
					options: ["Text", "Callout", "Task", "List"],
				},
			],
			action: "Capture",
		},
		{
			id: "aiPoweredNote",
			icon: "🤖",
			titleId: "hero.demo.aiPoweredNote.title",
			descriptionId: "hero.demo.aiPoweredNote.description",
			fields: [],
			action: "Comming Soon",
		},
	];

	return (
		<header className={styles.hero}>
			<div className={styles.heroBackground}>
				<div className={styles.heroGradient}></div>
			</div>

			<div className="container">
				<div className={styles.heroContent}>
					<div className={styles.heroText}>
						<h1 className={styles.heroTitle}>
							<Translate id="hero.title"></Translate>
						</h1>
						<p className={styles.heroSubtitle}>
							<Translate id="hero.subtitle"></Translate>
						</p>
						<div className={styles.heroButtons}>
							<Link className={styles.primaryButton} to="/docs">
								<Translate id="hero.getStarted"></Translate>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
								>
									<path
										d="M8.5 3L13.5 8L8.5 13M13 8H3"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
							<Link
								className={styles.secondaryButton}
								to="https://github.com/vran-dev/obsidian-form-flow"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="currentColor"
								>
									<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
								</svg>
								<Translate id="hero.viewSource">
									View Source
								</Translate>
							</Link>
						</div>
					</div>

					<div className={styles.heroDemo}>
						<div className={styles.demoTabs}>
							{demos.map((demo, index) => (
								<div
									key={demo.id}
									className={`${styles.demoTab} ${
										index === activeIndex
											? styles.active
											: ""
									}`}
									onClick={() => setActiveIndex(index)}
								>
									<span className={styles.tabIcon}>
										{demo.icon}
									</span>
									<Translate id={demo.titleId}>
										{demo.titleId}
									</Translate>
								</div>
							))}
						</div>
						<div className={styles.demoDescription}>
							<Translate id={demos[activeIndex].descriptionId}>
								{demos[activeIndex].descriptionId}
							</Translate>
						</div>
						<div className={styles.demoContainer}>
							<div className={styles.demoHeader}>
								<div className={styles.demoControls}>
									<span className={styles.demoControl}></span>
									<span className={styles.demoControl}></span>
									<span className={styles.demoControl}></span>
								</div>
								<span className={styles.demoTitle}>
									Form Flow
								</span>
							</div>
							<div className={styles.demoContent}>
								<DemoForm config={demos[activeIndex]} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
