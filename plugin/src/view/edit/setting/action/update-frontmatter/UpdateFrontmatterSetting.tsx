import { Trash2 } from "lucide-react";
import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import {
	UpdateFrontmatterFormAction,
	PropertyUpdate,
} from "src/model/action/UpdateFrontmatterFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { getFilePathCompatible } from "src/utils/getFilePathCompatible";
import CpsFormItem from "src/view/shared/CpsFormItem";
import {
	InteractiveList,
	InteractiveListItem,
} from "src/component/interactive-list/InteractiveList";
import { v4 } from "uuid";
import { FilePathFormItem } from "../common/FilePathFormItem";
import TargetFileTypeSelect from "../common/TargetFileTypeSelect";
import { PropertyUpdateValueInput } from "./PropertyUpdateValueInput";
import { PropertyNameSuggestInput } from "src/component/combobox/PropertyNameSuggestInput";

export function UpdateFrontmatterSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;

	if (value.type !== FormActionType.UPDATE_FRONTMATTER) {
		return null;
	}

	const action = value as UpdateFrontmatterFormAction;
	const items = action.propertyUpdates || [];
	const saveItem = (item: PropertyUpdate) => {
		const newItems = items.map((i) => {
			if (i.id === item.id) {
				return item;
			}
			return i;
		});
		const newAction = {
			...action,
			propertyUpdates: newItems,
		};
		props.onChange(newAction);
	};
	const targetFilePath = getFilePathCompatible(action);
	return (
		<>
			<CpsFormItem label={localInstance.target_file}>
				<TargetFileTypeSelect
					value={action.targetFileType}
					onChange={(value) => {
						const newAction = { ...action, targetFileType: value };
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>
			{action.targetFileType === TargetFileType.CURRENT_FILE ? (
				<></>
			) : (
				<>
					<FilePathFormItem
						label={""}
						value={targetFilePath}
						onChange={(value) => {
							const newAction = {
								...action,
								filePath: value,
							};
							props.onChange(newAction);
						}}
					/>
				</>
			)}

			<InteractiveList
				className="form--InteractiveList"
				title={localInstance.properties}
				items={items}
				onAdd={() => {
					const newItem: PropertyUpdate = {
						id: v4(),
						name: "",
						value: "",
					};
					const newItems = [...items, newItem];
					const newAction = {
						...action,
						propertyUpdates: newItems,
					};
					props.onChange(newAction);
				}}
				onChange={(items: PropertyUpdate[]) => {
					const newAction = {
						...action,
						propertyUpdates: items,
					};
					props.onChange(newAction);
				}}
			>
				{(item, index, remove) => {
					return (
						<InteractiveListItem
							className="form--InteractiveListItem"
							key={item.id}
							item={item}
						>
							<div className="form--InteractiveListItemFieldRow">
								<PropertyNameSuggestInput
									value={item.name || ""}
									onChange={(value) => {
										const newItem = {
											...item,
											name: value,
										};
										saveItem(newItem);
									}}
									placeholder={localInstance.property_name}
								/>
								<PropertyUpdateValueInput
									actionId={action.id}
									name={item.name}
									value={item.value}
									placeholder={localInstance.property_value}
									onChange={(value) => {
										const newItem = {
											...item,
											value: value,
										};
										saveItem(newItem);
									}}
								/>
							</div>
							<div className="form--InteractiveListItemActions">
								<button
									className="clickable-icon"
									data-type="danger"
									onClick={(e) => {
										remove(item);
									}}
								>
									<Trash2 />
								</button>
							</div>
						</InteractiveListItem>
					);
				}}
			</InteractiveList>
		</>
	);
}
