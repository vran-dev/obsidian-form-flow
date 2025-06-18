import { useRef, useState } from "react";
import "./ExtensionEditor.css";
import ExtensionFunctionBody from "./ExtensionFcuntionBody";
import ExtensionFunctionHeader from "./ExtensionFcuntionHeader";
import { FormScript } from "src/service/extend/FormScript";

export interface ExtensionEditorProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	extensions: FormScript[];
}

export default function ExtensionEditor(props: ExtensionEditorProps) {
	const { value, onChange, label, extensions } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const [activeExtension, setActiveExtension] =
		useState<FormScript | null>(
			extensions.length > 0 ? extensions[0] : null
		);

	// 选择扩展函数并插入到输入框
	const onSelectExtension = (extension: FormScript) => {
		const input = inputRef.current;
		if (input) {
			const start = input.selectionStart || 0;
			const value = props.value || "";
			const newFormula = value
				.slice(0, start)
				.concat(extension.name + `()`)
				.concat(value.slice(start));
			props.onChange(newFormula);
			input.value = newFormula;
		}
	};

	const sortedExtensions = extensions.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	return (
		<div className="form--ExtensionEditor">
			<ExtensionFunctionHeader
				value={value}
				onChange={onChange}
				label={label}
				inputRef={inputRef}
			/>

			<ExtensionFunctionBody
				extensions={sortedExtensions}
				activeExtension={activeExtension}
				setActiveExtension={setActiveExtension}
				onSelectExtension={onSelectExtension}
			/>
		</div>
	);
}
