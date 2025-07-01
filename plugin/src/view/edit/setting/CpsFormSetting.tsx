import { ClipboardIcon, Wrench, Zap } from "lucide-react";
import { Tab } from "src/component/tab/Tab";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";
import { IFormField } from "src/model/field/IFormField";
import { FormConfig } from "src/model/FormConfig";
import { formIntegrationService } from "src/service/command/FormIntegrationService";
import ToggleControl from "src/view/shared/control/ToggleControl";
import CpsForm from "src/view/shared/CpsForm";
import CpsFormItem from "src/view/shared/CpsFormItem";
import { CpsFormActions } from "./action/CpsFormActions";
import "./CpsFormSetting.css";
import { CpsFormSettingGroup } from "./CpsFormSettingGroup";
import { AsCommandToggle } from "./field/common/AsCommandToggle";
import CpsFormFields from "./field/CpsFormFields";

export default function (props: {
	filePath: string;
	formConfig: FormConfig;
	onChange: (config: FormConfig) => void;
}) {
	const { formConfig, onChange } = props;
	const app = useObsidianApp();
	const commandKeys = formIntegrationService
		.getShortcut(props.filePath, app)
		.join(",");

	// 递归替换对象中的标签引用
	const replaceLabelsInObject = (
		obj: any,
		labelMapping: Map<string, string>
	): any => {
		if (obj === null || obj === undefined) {
			return obj;
		}

		if (typeof obj === "string") {
			let result = obj;
			labelMapping.forEach((newLabel, oldLabel) => {
				const pattern = `{{@${oldLabel}}}`;
				if (result.includes(pattern)) {
					result = result.split(pattern).join(`{{@${newLabel}}}`);
				}
			});
			return result;
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => replaceLabelsInObject(item, labelMapping));
		}

		if (typeof obj === "object") {
			const result: Record<string, any> = {};
			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					result[key] = replaceLabelsInObject(obj[key], labelMapping);
				}
			}
			return result;
		}

		return obj;
	};

	const onFieldsChanged = (fields: IFormField[], modified: IFormField[]) => {
		let newConfig = {
			...formConfig,
			fields: fields,
		};

		if (modified.length > 0) {
			// 创建旧标签到新标签的映射
			const labelMapping = new Map<string, string>();
			for (const field of modified) {
				const old = field.label;
				const newLabel = fields.find((f) => f.id === field.id)?.label;
				if (old !== newLabel && newLabel !== undefined) {
					labelMapping.set(old, newLabel);
				}
			}

			// 如果有需要替换的标签，递归替换对象中的标签引用
			if (labelMapping.size > 0) {
				newConfig = replaceLabelsInObject(newConfig, labelMapping);
			}
		}

		onChange(newConfig);
	};

	return (
		<Tab
			items={[
				{
					id: "basic",
					title: localInstance.basic_setting,
					content: (
						<CpsForm
							layout="vertical"
							className="form--CpsFormEditView"
						>
							<CpsFormSettingGroup
								icon={<ClipboardIcon />}
								title={localInstance.form_fields_setting}
							>
								<CpsFormFields
									fields={formConfig.fields}
									onSave={onFieldsChanged}
								/>
							</CpsFormSettingGroup>

							<CpsFormSettingGroup
								icon={<Zap />}
								title={localInstance.form_action_setting}
							>
								<CpsFormActions
									config={formConfig}
									onChange={(action) => {
										const newConfig = {
											...formConfig,
											action: undefined,
											actions: action,
										};
										onChange(newConfig);
									}}
								/>
							</CpsFormSettingGroup>
						</CpsForm>
					),
				},
				{
					id: "other",
					title: localInstance.other_setting,
					content: (
						<CpsForm>
							<CpsFormSettingGroup
								icon={<Wrench />}
								title={localInstance.other_setting}
							>
								<CpsFormItem
									label={localInstance.register_as_command}
								>
									<a
										className="form--FormFieldLabelDescription"
										onClick={(e) => {
											app.setting.open();
											app.setting.openTabById("hotkeys");
										}}
									>
										{
											localInstance.register_as_command_description
										}
									</a>
									{commandKeys?.length > 0 && (
										<span className="form--CommandHotkeyLabel">
											{commandKeys}
										</span>
									)}
									<AsCommandToggle
										filePath={props.filePath}
									/>
								</CpsFormItem>
								<CpsFormItem label={localInstance.auto_submit}>
									<span className="form--FormFieldLabelDescription">
										{localInstance.auto_submit_description}
									</span>
									<ToggleControl
										value={formConfig.autoSubmit === true}
										onValueChange={(v) => {
											const newConfig = {
												...formConfig,
												autoSubmit: v,
											};
											onChange(newConfig);
										}}
									/>
								</CpsFormItem>
							</CpsFormSettingGroup>
						</CpsForm>
					),
				},
			]}
		/>
	);
}
