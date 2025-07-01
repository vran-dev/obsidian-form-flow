import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { Eye, EyeOff } from "lucide-react";
import "./PasswordInput.css";
import { useRef, useState } from "react";

type PasswordInputProps = {
	value: string;
	name?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	autoFocus?: boolean;
	required?: boolean;
};

export function PasswordInput(props: PasswordInputProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};
	const { onChange, value, ...rest } = props;

	return (
		<PasswordToggleField.Root>
			<div
				ref={containerRef}
				className={`form--PasswordInputContainer`}
				data-focused={isFocused}
			>
				<PasswordToggleField.Input
					{...rest}
					className="form--PasswordInput"
					value={props.value}
					onChange={(e) => {
						props.onChange(e.target.value);
					}}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				<PasswordToggleField.Toggle className="form--PasswordToggle">
					<PasswordToggleField.Icon
						className="form--PasswordToggleIcon"
						visible={<Eye />}
						hidden={<EyeOff />}
					/>
				</PasswordToggleField.Toggle>
			</div>
		</PasswordToggleField.Root>
	);
}
