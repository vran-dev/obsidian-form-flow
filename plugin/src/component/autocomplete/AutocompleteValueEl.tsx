import { XIcon } from "lucide-react";
import "./AutocompleteValueEl.css";
import { AutocompleteOption } from "./Autocomplete";

export function AutocompleteValueEl(props: {
	option: AutocompleteOption;
	onRemove: () => void;
}) {
	const { option } = props;
	return (
		<div className="form--AutocompleteValueEl">
			<span className="form--AutocompleteValueLabel">{option.label}</span>
			<span
				className="form--AutocompleteValueRemove"
				onClick={props.onRemove}
			>
				<XIcon size={12} />
			</span>
		</div>
	);
}
