import { CodeIcon } from "lucide-react";
import { Command } from "obsidian";
import { useCallback, useMemo } from "react";
import {
	Autocomplete,
	AutocompleteOption,
} from "src/component/autocomplete/Autocomplete";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";

export class CommandInfo {
	id: string;
	name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}
}

export function ObsidianCommandAutocomplete(props: {
	commandId?: string;
	onChange: (path: { id: string; name: string }) => void;
}): JSX.Element {
	const app = useObsidianApp();
	const { commandId } = props;

	const getCommands = useCallback(() => {
		/**
		 * commands is a object, key is command id, value is command
		 */
		// @ts-ignore
		const commands = app.commands.commands;

		const matchedCommands: Command[] = [];
		for (const key in commands) {
			const element = commands[key];
			matchedCommands.push(element);
		}
		return matchedCommands.map((command: Command) => {
			return {
				id: command.id,
				value: command.id,
				label: command.name,
				icon: <CodeIcon size={14} />,
			};
		});
	}, []);

	const label = useMemo(() => {
		if (!commandId) {
			return "";
		}
		return app.commands.findCommand(commandId)?.name || commandId;
	}, [commandId]);

	const getCommandName = useCallback((id: string): string => {
		return app.commands.findCommand(id)?.name || id;
	}, []);

	return (
		<Autocomplete
			label={label}
			value={commandId}
			onSelect={function (value: string): void {
				if (!value) {
					props.onChange({ id: "", name: "" });
					return;
				}

				props.onChange({
					id: value,
					name: getCommandName(value),
				});
			}}
			getOptions={getCommands}
		/>
	);
}
