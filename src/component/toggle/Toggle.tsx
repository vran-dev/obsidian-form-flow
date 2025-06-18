import "./Toggle.css";

export interface ToggleOption<T> {
	id: string;
	label: string;
	value: T;
}

interface ToggleProps<T> {
	value: T;
	options: ToggleOption<T>[];
	onChange: (value: T) => void;
	className?: string;
}

export default function <T>(props: ToggleProps<T>) {
	const { value, onChange, options } = props;
	return (
		<div className={`form--ToggleContainer ${props.className || ""}`}>
			{options.map((option) => {
				return (
					<div
						key={option.id}
						className={`form--ToggleItem ${
							value == option.value
								? "form--ToggleItem_active"
								: ""
						}`}
						onClick={() => onChange(option.value)}
					>
						{option.label}
					</div>
				);
			})}
		</div>
	);
}
