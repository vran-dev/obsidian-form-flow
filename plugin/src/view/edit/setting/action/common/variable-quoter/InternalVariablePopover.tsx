import { ChevronsUpDown } from "lucide-react";
import { DateTime } from "luxon";
import { DropdownMenu } from "radix-ui";
import "./InternalVariablePopover.css";
import { localInstance } from "src/i18n/locals";

export const internalFieldNames = [
	{
		name: "{{date}}",
		description: DateTime.now().toFormat("yyyy-MM-dd"),
	},
	{
		name: "{{time}}",
		description: DateTime.now().toFormat("HH:mm"),
	},
	{
		name: "{{date:YYYY-MM-DDTHH:mm}}",
		description: DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
	},
	{
		name: "{{date:YYMMDD}}",
		description: DateTime.now().toFormat("yyMMdd"),
	},
	{
		name: "{{selection}}",
		description: localInstance.selection_variable_description,
	},
	{
		name: "{{clipboard}}",
		description: localInstance.clipboard_variable_description,
	},
];

export default function (props: { onSelect: (value: string) => void }) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className={"form--FormInternalVariablesButton"}>
					{localInstance.internal_variables}
					<ChevronsUpDown size={16} />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				className="form--FormInternalVariables"
				align="start"
			>
				{internalFieldNames.map((option) => {
					return (
						<DropdownMenu.Item
							key={option.name}
							className="form--FormInternalVariable"
							onSelect={() => {
								props.onSelect(option.name);
							}}
						>
							<span className="form--FormInternalVariableName">
								{option.name}
							</span>
							<span className="form--FormInternalVariableDescription">
								{option.description}
							</span>
						</DropdownMenu.Item>
					);
				})}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
