import { Trash2 } from "lucide-react";
import {
	InteractiveList,
	InteractiveListItem,
} from "src/component/interactive-list/InteractiveList";
import useSortable from "src/hooks/useSortable";
import { localInstance } from "src/i18n/locals";
import { IOptionsField } from "src/model/field/ISelectField";
import { v4 } from "uuid";
import "./CpsFormSelectFieldSetting.css";

export default function (props: {
	field: IOptionsField;
	onFieldChange: (field: IOptionsField) => void;
}) {
	const onFieldChange = props.onFieldChange;
	const enableCustomValue = props.field.enableCustomValue === true;
	const items = props.field.options || [];
	useSortable({
		items: items || [],
		getId: (item) => item.id,
		onChange: (orders) => {
			onFieldChange({
				...props.field,
				options: orders,
			});
		},
	});
	const addOption = () => {
		const newOption = {
			id: v4(),
			label: "",
			value: "",
		};
		const newField: IOptionsField = {
			...props.field,
			options: [...items, newOption],
		};
		props.onFieldChange(newField);
	};

	const updateOption = (option: {
		id: string;
		label: string;
		value: string;
	}) => {
		const newOptions = items.map((o) => {
			if (o.id === option.id) {
				return option;
			}
			return o;
		});
		const newField: IOptionsField = {
			...props.field,
			options: newOptions,
		};
		props.onFieldChange(newField);
	};

	return (
		<>
			<InteractiveList
				className="form--InteractiveList"
				items={items}
				onAdd={() => {
					addOption();
				}}
				onChange={(
					items: { id: string; label: string; value: string }[]
				) => {
					const newField: IOptionsField = {
						...props.field,
						options: items,
					};
					props.onFieldChange(newField);
				}}
				addButtonLabel={localInstance.add_list_item}
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
									required={true}
									placeholder={localInstance.label}
									style={{
										flex: 1,
									}}
									onChange={(e) => {
										const newItem = {
											...item,
											label: e.target.value,
										};
										updateOption(newItem);
									}}
								/>
								{enableCustomValue && (
									<textarea
										className="form--CpsFormSelectOptionValueTextarea"
										value={item.value}
										rows={3}
										required={true}
										placeholder={localInstance.value}
										onChange={(e) => {
											updateOption({
												...item,
												value: e.target.value,
											});
										}}
									/>
								)}
							</div>
							<div className="form--InteractiveListItemActions">
								<button
									className="form--Btn"
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
