import { useRef, RefObject, useEffect } from "react";
import useInputComposition from "src/hooks/useInputComposition";
import { localInstance } from "src/i18n/locals";

interface ExtensionFunctionHeaderProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	inputRef?: RefObject<HTMLInputElement>;
}

export default function ExtensionFunctionHeader(
	props: ExtensionFunctionHeaderProps
) {
	const { value, onChange, label, inputRef } = props;
	const defaultInputRef = useRef<HTMLInputElement>(null);
	const actualInputRef = inputRef || defaultInputRef;
	const { isCompositionRef, onCompositionStart, onCompositionEnd } =
		useInputComposition();
	return (
		<div className="form--ExtensionEditorHeader">
			{label && (
				<div className="form--ExtensionEditorHeaderLabel">
					<span>{label}</span>
				</div>
			)}
			<div className="form--ExtensionEditorHeaderInput">
				<input
					value={value}
					ref={actualInputRef}
					onCompositionStart={onCompositionStart}
					onCompositionEnd={(e) => {
						onCompositionEnd();
						const target = e.target as HTMLInputElement;
						onChange(target.value);
					}}
					onChange={(e) => {
						if (isCompositionRef.current) return;
						const target = e.target as HTMLInputElement;
						onChange(target.value);
					}}
					placeholder={localInstance.typing}
				/>
			</div>
		</div>
	);
}
