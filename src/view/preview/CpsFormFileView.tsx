import { Presentation, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { FormConfig } from "../../model/FormConfig";
import CpsFormEditView from "../edit/CpsFormEditView";
import CpsFormActionView from "./CpsFormActionView";
import "./CpsFormFileView.css";
import { FormConfigContext } from "src/hooks/useFormConfig";
import { localInstance } from "src/i18n/locals";

type Props = {
	filePath: string;
	formConfig: FormConfig;
	options?: {
		hideHeader?: boolean;
		showFilePath?: boolean;
		afterSubmit?: (state: Record<string, any>) => void;
	};
} & React.HTMLAttributes<HTMLDivElement>;

export function CpsFormFileView(props: Props) {
	const viewOptions = props.options || {};
	const [inEditing, setInEditing] = useState<boolean>(false);
	const { filePath, options, className, formConfig: config, ...rest } = props;
	const { formConfig, formFile } = useForm(filePath, props.formConfig);
	const fileName = formFile.split("/").pop() || "";
	const fileBasename = fileName.split(".")[0] || "";

	return (
		<FormConfigContext.Provider value={formConfig}>
			<div
				className={`form--CpsFormFileView ${className ?? ""}`}
				{...rest}
			>
				{viewOptions.hideHeader !== true && (
					<div
						className="form--CpsFormFileViewHeader"
						data-editing={inEditing}
					>
						{<div>{fileBasename}</div>}
						{inEditing ? (
							<button
								className="form--CpsFormFileViewModeButton"
								onClick={() => setInEditing(false)}
							>
								<Presentation size={16} />
								{localInstance.click_switch_to_preview_mode}
							</button>
						) : (
							<button
								className="form--CpsFormFileViewModeButton"
								onClick={() => setInEditing(true)}
							>
								<Settings size={16} />
							</button>
						)}
					</div>
				)}
				{inEditing === true ? (
					<CpsFormEditView
						defaultConfig={formConfig}
						filePath={formFile}
					/>
				) : (
					<CpsFormActionView
						formConfig={formConfig}
						options={props.options}
					/>
				)}
			</div>
		</FormConfigContext.Provider>
	);
}
