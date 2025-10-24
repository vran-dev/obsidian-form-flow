import React, { forwardRef, HTMLAttributes } from "react";
import { AutocompleteOption } from "./Autocomplete";

export const AutocompleteOptionEl = forwardRef(function AutocompleteOption(
	props: {
		option: AutocompleteOption;
	} & HTMLAttributes<HTMLDivElement>,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	const { option, ...reset } = props;
	return (
		<div className="form--AutocompleteOption" ref={ref} {...reset}>
			{option.icon && (
				<span className="form--AutocompleteOptionIcon">
					{option.icon}
				</span>
			)}
			<div className="form--AutocompleteOptionContent">
				<span className="form--AutocompleteOptionLabel">
					{option.label}
				</span>
				{option.description && (
					<span className="form--AutocompleteOptionDescription">
						{option.description}
					</span>
				)}
			</div>
		</div>
	);
});
