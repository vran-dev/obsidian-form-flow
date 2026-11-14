import { DropIndicator } from "src/component/drop-indicator/DropIndicator";
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
	const {
		closestEdge,
		dragging,
		draggedOver,
		setElRef,
		setDragHandleRef,
		attributes,
		listeners,
		style,
	} = useSortableItem(field.id);

	return (
		<FormFieldContext.Provider
			value={{
				field: field,
				index: props.index,
			}}
		>
			<div
				className="form--CpsFormFieldSetting"
				ref={setElRef}
				style={style}
			>
				<FormFieldSettingHeader
					field={field}
					onChange={props.onChange}
					onDelete={props.onDelete}
					onDuplicate={props.onDuplicate}
					setDragHandleRef={setDragHandleRef}
					listeners={listeners}
					attributes={attributes}
				></FormFieldSettingHeader>
				<CpsFormFieldSettingContent field={field} onChange={onChange} />
				{closestEdge && (
					<DropIndicator
						edge={closestEdge as "top" | "bottom" | "left" | "right"}
						gap="1px"
					/>
				)}
			</div>
		</FormFieldContext.Provider>
	);
}
