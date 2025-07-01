import { useId } from "react";
import "./RadioSelect.css";

export type RadioOption = {
	id: string;
	label: string;
	value: any;
};

export default function (props: {
	name?: string;
	value: any;
	options: RadioOption[];
	onChange: (value: any) => void;
	required?: boolean;
	autoFocus?: boolean;
}) {
	const { value, onChange, autoFocus } = props;
	const options = props.options || [];
	const id = useId();
	return (
		<div className="form--RadioSelect">
			{options.map((option, index) => {
				return (
					<Option
						key={option.id}
						value={value}
						onChange={onChange}
						name={props.name || id}
						option={option}
						required={props.required === true}
						autoFocus={autoFocus && index === 0}
					/>
				);
			})}
		</div>
	);
}

function Option(props: {
	name: string;
	value: any;
	onChange: (value: any) => void;
	option: RadioOption;
	autoFocus?: boolean;
	required?: boolean;
}) {
	const { option, autoFocus, value, onChange, name } = props;
	const optionValue = option.value || option.label;
	const isChecked = value === optionValue;
	return (
		<label key={option.value} className="form--RadioSelectOption" data-checked={isChecked === true}>
			<input
				type="radio"
				name={name}
				value={optionValue}
				checked={isChecked}
				onChange={(e) => onChange(e.target.value)}
				autoFocus={autoFocus}
				required={props.required}
			/>
			{option.label}
		</label>
	);
}
