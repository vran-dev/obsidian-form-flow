import { ChevronsUpDown } from "lucide-react";
import { Notice } from "obsidian";
import { DropdownMenu } from "src/component/dropdown";
import { localInstance } from "src/i18n/locals";
import { FormConfig } from "src/model/FormConfig";
import { Objects } from "src/utils/Objects";
import "./FormVariableQuotePanel.css";
import InternalVariablePopover from "./InternalVariablePopover";

export default function (props: { formConfig: FormConfig }) {
	const fields = props.formConfig.fields || [];
	const fieldNames = fields
		.map((f) => f.label)
		.filter((l) => Objects.exists(l) && l !== "")
		.reduce((acc, l) => {
			// distinct
			if (!acc.includes(l)) {
				acc.push(l);
			}
			return acc;
		}, [] as string[])
		.map((f) => {
			return { id: f, label: f, value: f };
		});

	const copyVariable = (fieldName: string) => {
		navigator.clipboard.writeText(`{{@${fieldName}}}`).then(
			() => {
				new Notice(localInstance.copy_success);
			},
			() => {
				new Notice(localInstance.copy_failed);
			}
		);
	};

	const copyInnerVariable = (fieldName: string) => {
		navigator.clipboard.writeText(fieldName).then(
			() => {
				new Notice(localInstance.copy_success);
			},
			() => {
				new Notice(localInstance.copy_failed);
			}
		);
	};
	return (
		<div className="form--FormVariableQuotePanel ">
			<span className="form--CpsFormDescription">
				{localInstance.form_variable_usage}
			</span>
			<div className="form--FormVariables">
				<DropdownMenu
					menuLabel={localInstance.form_variables}
					menuIcon={<ChevronsUpDown size={16} />}
					items={fieldNames}
					onSelect={(item, e) => {
						copyVariable(item.value);
					}}
				/>
				<span> | </span>
				<InternalVariablePopover
					onSelect={(value) => {
						copyInnerVariable(value);
					}}
				/>
			</div>
		</div>
	);
}
