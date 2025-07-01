import { Trash2 } from "lucide-react";
import { localInstance } from "src/i18n/locals";
import {
	IFormAction,
	DEFAULT_CODE_FOR_ACTION,
} from "src/model/action/IFormAction";
import {
	SuggestModalFormAction,
	SuggestItem,
	SuggestSource,
} from "src/model/action/SuggestModalFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormItem from "src/view/shared/CpsFormItem";
import {
	InteractiveList,
	InteractiveListItem,
} from "src/component/interactive-list/InteractiveList";
import { v4 } from "uuid";
import CodeEditor from "../common/code-editor/CodeEditor";
import { SuggestSourceSelect } from "./SuggestSourceSelect";

export function SuggestModalSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;
	if (value.type !== FormActionType.SUGGEST_MODAL) {
		return null;
	}
	const action = value as SuggestModalFormAction;
	const items = action.items || [];

	const saveItem = (item: SuggestItem) => {
		const newItems = items.map((i) => {
			if (i.id === item.id) {
				return item;
			}
			return i;
		});
		const newAction = {
			...action,
			items: newItems,
		};
		props.onChange(newAction);
	};

	return (
		<>
			<CpsFormItem label={localInstance.field_name}>
				<input
					type="text"
					value={action.fieldName || ""}
					onChange={(e) => {
						const newAction = {
							...action,
							fieldName: e.target.value,
						};
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>

			<CpsFormItem label={localInstance.candidate_values}>
				<SuggestSourceSelect
					value={action.suggestSource || SuggestSource.LIST}
					onChange={(value) => {
						const newAction = {
							...action,
							suggestSource: value,
						};
						props.onChange(newAction);
					}}
				></SuggestSourceSelect>
			</CpsFormItem>

			{action.suggestSource === SuggestSource.SCRIPT ? (
				<CodeEditor
					initialValue={action.code || DEFAULT_CODE_FOR_ACTION}
					onChange={(code) => {
						const newAction = {
							...action,
							code: code,
						};
						props.onChange(newAction);
					}}
					height="680px"
				/>
			) : (
				<InteractiveList
					className="form--InteractiveList"
					items={items}
					onAdd={() => {
						const newItem: SuggestItem = {
							id: v4(),
							label: "",
							value: "",
						};
						const newItems = [...items, newItem];
						const newAction = {
							...action,
							items: newItems,
						};
						props.onChange(newAction);
					}}
					onChange={(items: SuggestItem[]) => {
						const newAction = {
							...action,
							items: items,
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
									<input
										type="text"
										value={item.label}
										placeholder={localInstance.label}
										style={{
											flex: 1,
										}}
										onChange={(e) => {
											const newItem = {
												...item,
												label: e.target.value,
											};
											saveItem(newItem);
										}}
									/>
									<input
										type="text"
										value={item.value}
										placeholder={
											item.label || localInstance.value
										}
										style={{
											flex: 1,
										}}
										onChange={(e) => {
											const newItem = {
												...item,
												value: e.target.value,
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
			)}
		</>
	);
}
