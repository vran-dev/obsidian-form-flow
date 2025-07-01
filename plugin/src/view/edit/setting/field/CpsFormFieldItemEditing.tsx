import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { FormField, IFormField } from "../../../../model/field/IFormField";
import { CpsFormFieldSettingContent } from "./setting-content/CpsFormFieldSettingContent";
import { FormFieldSettingHeader } from "./setting-header/FormFieldSettingHeader";
import { FormFieldContext } from "./hooks/FormFieldContext";
import useSortableItem from "src/hooks/useSortableItem";

export function CpsFormFieldItemEditing(props: {
	index: number;
	field: FormField;
	onDelete: (field: IFormField) => void;
	onChange: (field: IFormField) => void;
	onDuplicate: (field: IFormField) => void;
}) {
	const { field, onChange } = props;
	const { closestEdge, dragging, draggedOver, setElRef, setDragHandleRef } =
		useSortableItem(field.id);

	return (
		<FormFieldContext.Provider
			value={{
				field: field,
				index: props.index,
			}}
		>
			<div className="form--CpsFormFieldSetting" ref={setElRef}>
				<FormFieldSettingHeader
					field={field}
					onChange={props.onChange}
					onDelete={props.onDelete}
					onDuplicate={props.onDuplicate}
					setDragHandleRef={setDragHandleRef}
				></FormFieldSettingHeader>
				<CpsFormFieldSettingContent field={field} onChange={onChange} />
				{closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
			</div>
		</FormFieldContext.Provider>
	);
}
