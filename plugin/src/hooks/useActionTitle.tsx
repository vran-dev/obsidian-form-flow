import { normalizePath } from "obsidian";
import { useMemo } from "react";
import { CreateFileFormAction } from "../model/action/CreateFileFormAction";
import { IFormAction } from "../model/action/IFormAction";
import { InsertTextFormAction } from "../model/action/InsertTextFormAction";
import {
	RunScriptFormAction,
	ScriptSourceType,
} from "../model/action/RunScriptFormAction";
import { SuggestModalFormAction } from "../model/action/SuggestModalFormAction";
import { WaitFormAction } from "../model/action/WaitFormAction";
import { FormActionType } from "../model/enums/FormActionType";
import { TargetFileType } from "../model/enums/TargetFileType";
import { formActionTypeOptions } from "../view/edit/setting/action/common/ActionTypeSelect";
import { allFormInsertPositionOptions } from "../view/edit/setting/action/common/InsertPositionSelect";
import { localInstance } from "src/i18n/locals";
import { Strings } from "src/utils/Strings";

export function useActionTitle(value: IFormAction) {
	const heading = useMemo(() => {
		const typeLabel =
			formActionTypeOptions.find((t) => t.value === value.type)?.label ||
			"";

		let title = "";

		if (value.type === FormActionType.SUGGEST_MODAL) {
			const suggestAction = value as SuggestModalFormAction;
			if (!suggestAction.fieldName || suggestAction.fieldName === "") {
				title = localInstance.unnamed;
			} else {
				title = suggestAction.fieldName;
			}
		}

		if (value.type === FormActionType.RUN_SCRIPT) {
			const scriptAction = value as RunScriptFormAction;
			if (scriptAction.scriptSource === ScriptSourceType.INLINE) {
				title = scriptAction.title || "";
			}
		}

		if (value.type === FormActionType.CREATE_FILE) {
			const createFileAction = value as CreateFileFormAction;

			if (Strings.isEmpty(createFileAction.filePath)) {
				title = localInstance.file_path_required;
			} else {
				title = normalizePath(createFileAction.filePath);
			}
		}

		if (value.type === FormActionType.INSERT_TEXT) {
			const insertTextAction = value as InsertTextFormAction;
			let file = "";
			let position = "";
			if (
				insertTextAction.targetFileType === TargetFileType.CURRENT_FILE
			) {
				file = localInstance.in_current_file;
				position = "";
			} else {
				if (Strings.isEmpty(insertTextAction.filePath)) {
					title = localInstance.file_path_required;
				} else {
					title = normalizePath(insertTextAction.filePath);
				}
				position =
					allFormInsertPositionOptions.find(
						(p) => p.value === insertTextAction.position
					)?.label || "";
			}

			title = file + " " + position;
		}

		if (value.type === FormActionType.WAIT) {
			const waitAction = value as WaitFormAction;
			const time = waitAction.waitTime ?? 300;
			const unitLabel = localInstance.milliseconds;
			
			title = `${time} ${unitLabel}`;
		}

		if (value.type === FormActionType.RUN_COMMAND) {
			const runCommandAction = value as any;
			title =
				runCommandAction.commandName ||
				runCommandAction.commandId ||
				localInstance.no_command_selected;
		}

		return {
			type: typeLabel,
			title: title,
		};
	}, [value]);
	return heading;
}
