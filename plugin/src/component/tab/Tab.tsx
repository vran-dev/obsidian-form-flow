import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import "./Tab.css";

export interface TabItem {
	id: string;
	title: string;
	content: React.ReactNode;
}

export interface TabProps {
	items: TabItem[];
	defaultValue?: string;
	orientation?: "horizontal" | "vertical";
	onChange?: (value: string) => void;
	className?: string;
}

export function Tab({
	items,
	defaultValue,
	orientation = "horizontal",
	onChange,
	className = "",
}: TabProps) {
	// Simplified implementation without custom lazy loading
	const defaultTab = defaultValue || items[0]?.id;

	return (
		<Tabs.Root
			defaultValue={defaultTab}
			className={`form--TabGroup ${className}`}
			data-orientation={orientation}
			onValueChange={onChange}
		>
			<Tabs.List
				className="form--TabList"
				data-orientation={orientation}
			>
				{orientation === "vertical" && (
					<div className="form--TabResizeBar"></div>
				)}
				{items.map((item) => (
					<Tabs.Trigger
						key={item.id}
						value={item.id}
						className="form--Tab"
					>
						<span className="form--TabTitle">
							{item.title}
						</span>
					</Tabs.Trigger>
				))}
			</Tabs.List>

			<div className="form--TabPanels">
				{items.map((item) => (
					<Tabs.Content
						key={item.id}
						value={item.id}
						className="form--TabPanel"
					>
						{item.content}
					</Tabs.Content>
				))}
			</div>
		</Tabs.Root>
	);
}
