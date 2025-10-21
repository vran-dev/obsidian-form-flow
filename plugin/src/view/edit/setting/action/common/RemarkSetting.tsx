import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import CpsFormItem from "src/view/shared/CpsFormItem";

export function RemarkSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value, onChange } = props;

	return (
		<CpsFormItem label={localInstance.remark}>
			<input
				type="text"
				value={value.remark || ""}
				onChange={(e) => {
					const newValue = {
						...value,
						remark: e.target.value || undefined,
					};
					onChange(newValue);
				}}
				placeholder={localInstance.brief_description}
			/>
		</CpsFormItem>
	);
}