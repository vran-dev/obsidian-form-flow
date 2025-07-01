import { DemoConfig, DemoField } from "@site/src/types/DemoConfig";
import styles from "../Hero.module.css";
import { useCallback } from "react";

export default function DemoForm(props: { config: DemoConfig }): JSX.Element {
	const config = props.config;

	const fieldEl = useCallback((field: DemoField) => {
		if (field?.type === "select") {
			return (
				<select
					className={styles.fieldInput}
					value={field.value}
					disabled
				>
					<option value={field.value}>{field.value}</option>
				</select>
			);
		} else if (field?.type === "radio") {
			return (
				<div className={styles.radioGroup}>
					{field.options?.map((option) => (
						<label key={option} className={styles.radioLabel}>
							<input
								type="radio"
								checked={field.value === option}
								disabled
							/>
							<span className={styles.radioText}>{option}</span>
						</label>
					))}
				</div>
			);
		} else if (field.type === "textarea") {
			return (
				<textarea
					className={styles.fieldInput}
					value={field.value}
					rows={10}
					readOnly
				/>
			);
		} else {
			return (
				<input
					className={styles.fieldInput}
					type={field?.type}
					value={field?.value}
					readOnly
				/>
			);
		}
	}, []);

	const fields = config.fields || [];
	return (
		<div className={styles.demoForm}>
			{fields.map((field, index) => (
				<div key={index} className={styles.formField}>
					<label className={styles.fieldLabel}>{field.label}</label>
					{fieldEl(field)}
				</div>
			))}
			{fields.length === 0 && (
				// comming soon
				<div className={styles.formField}>
					<label className={styles.fieldLabel}>Coming Soon</label>
					<input
						className={styles.fieldInput}
						type="text"
						value="🔥 This feature is under development."
						readOnly
					/>
				</div>
			)}

			<div className={styles.formActions}>
				<button className={styles.formButton}>
					{config.action}
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M8.5 3L13.5 8L8.5 13M13 8H3"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
