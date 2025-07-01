import { CircleAlert, Network } from "lucide-react";
import { useMemo, useState } from "react";
import { v4 } from "uuid";
import CpsFormSelectFieldSetting from "../select/CpsFormSelectFieldSetting";
import "./CpsFormFieldSettingContent.css";
import { DescriptionSetting } from "./description/DescriptionSetting";
import { SelectFieldSettingHeader } from "./SelectFieldSettingHeader";
import Dialog2 from "src/component/dialog/Dialog2";
import { FilterRoot } from "src/component/filter/FilterRoot";
import { localInstance } from "src/i18n/locals";
import { IFormField } from "src/model/field/IFormField";
import { IOptionsField } from "src/model/field/ISelectField";
import { Filter, FilterType } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { FormValidator } from "src/service/validator/FormValidator";
import { CpsFormFieldControl } from "src/view/shared/control/CpsFormFieldControl";
import { FormCondition } from "src/view/shared/filter-content/FormCondition";

export function CpsFormFieldSettingContent(props: {
	field: IFormField;
	onChange: (field: IFormField) => void;
}) {
	const { field, onChange } = props;
	const [openCondition, setOpenCondition] = useState(false);
	const [isOptionsEditing, setInOptionsEditing] = useState(false);
	const condition: Filter = field.condition ?? {
		id: v4(),
		type: FilterType.group,
		operator: OperatorType.And,
		conditions: [],
	};

	const fieldConditionLength = useMemo(() => {
		if (!field.condition) {
			return 0;
		}
		if (!field.condition.conditions) {
			return 0;
		}
		return field.condition.conditions.length;
	}, [field.condition]);

	const error = useMemo(() => {
		const res = FormValidator.validateField(field);
		if (res.valid) {
			return null;
		}
		return res.message;
	}, [field]);

	return (
		<div className="form--CpsFormFieldSettingContent">
			{field.enableDescription && (
				<DescriptionSetting field={field} onChange={onChange} />
			)}

			{error && (
				<div className="form--CpsFormFieldSettingError">
					<CircleAlert size={14} /> {error}
				</div>
			)}

			<div className="form--CpsFormFieldSettingContentHeader">
				<button
					className="form--VisibilityConditionButton"
					data-has-condition={fieldConditionLength > 0}
					onClick={() => {
						setOpenCondition(true);
					}}
				>
					<Network size={14} />
					{localInstance.visibility_condition}
					{fieldConditionLength > 0 && ` + ${fieldConditionLength}`}
				</button>
				<SelectFieldSettingHeader
					field={field as IOptionsField}
					setInEditing={setInOptionsEditing}
				/>
			</div>

			<div className="form--CpsFormFieldSettingControlPreview">
				{isOptionsEditing ? (
					<CpsFormSelectFieldSetting
						field={field as IOptionsField}
						onFieldChange={onChange}
					/>
				) : (
					<CpsFormFieldControl
						field={field}
						value={field.defaultValue}
						onValueChange={(v) => {
							const newField = { ...field, defaultValue: v };
							onChange(newField);
						}}
					/>
				)}
			</div>
			<Dialog2
				open={openCondition}
				onOpenChange={function (open: boolean): void {
					setOpenCondition(open);
				}}
			>
				{(close) => {
					return (
						<FilterRoot
							filter={condition}
							onFilterChange={(filter: Filter) => {
								const newField = {
									...field,
									condition: filter,
								};
								onChange(newField);
							}}
							filterContentComponent={FormCondition}
						/>
					);
				}}
			</Dialog2>
		</div>
	);
}
