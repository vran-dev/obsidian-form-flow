import { Copy, MoreHorizontal, Trash2, X } from "lucide-react";
import { Popover } from "radix-ui";
import { ConfirmPopover } from "src/component/confirm/ConfirmPopover";
import { DragHandler } from "src/component/drag-handler/DragHandler";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFormField } from "src/model/field/IFormField";
import { FormTypeSelect } from "src/view/shared/select/FormTypeSelect";
import { fieldTypeOptions } from "../common/FieldTypeSelect";
import { CpsFormFieldDetailEditing } from "../CpsFormFieldDetailEditing";
import "./FormFieldSettingHeader.css";

export function FormFieldSettingHeader(props: {
	children?: React.ReactNode;
	field: IFormField;
	onChange: (field: IFormField) => void;
	onDelete: (field: IFormField) => void;
	onDuplicate: (field: IFormField) => void;
	setDragHandleRef: (ref: HTMLDivElement | null) => void;
}) {
	const { field, setDragHandleRef, onChange, onDuplicate } = props;
	return (
		<div
			className="form--CpsFormFieldSettingHeader"
			data-required={field.required}
		>
			<DragHandler
				ref={setDragHandleRef}
				aria-label={localInstance.drag_and_drop_to_reorder}
			/>

			{field.required && (
				<span className="form--CpsFormFieldSettingLabelRequired">
					*
				</span>
			)}
			<input
				type="text"
				className="form--CpsFormFieldSettingLabelInlineInput"
				value={field.label}
				placeholder={localInstance.please_input_name}
				onChange={(e) => {
					const newField = {
						...field,
						label: e.target.value,
					};
					props.onChange(newField);
				}}
			/>

			<div className="form--CpsFormFieldSettingHeaderControl">
				<FormTypeSelect
					value={field.type}
					hideLabel={true}
					onChange={(value) => {
						const newField = {
							...field,
							type: value as FormFieldType,
						};
						props.onChange(newField);
					}}
					options={fieldTypeOptions}
				/>

				<ConfirmPopover
					onConfirm={() => {
						props.onDelete(field);
					}}
					title={localInstance.confirm_to_delete}
				>
					<button
						className="clickable-icon"
						aria-label={localInstance.delete}
						data-type="danger"
					>
						<Trash2 size={14} />
					</button>
				</ConfirmPopover>
				<Popover.Root>
					<Popover.Trigger asChild>
						<button
							className="clickable-icon"
							aria-label={localInstance.more}
						>
							<MoreHorizontal size={14} />
						</button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content
							sideOffset={24}
							side="right"
							align="start"
							className="form--CpsFormFieldSettingPopover"
							collisionPadding={{
								left: 16,
								right: 16,
								top: 8,
								bottom: 8,
							}}
						>
							<div className="form--CpsFormFieldSettingPopoverTitle">
								<button
									className="clickable-icon"
									aria-label={localInstance.duplicate}
									onClick={onDuplicate.bind(null, field)}
								>
									<Copy size={14} />
								</button>
								{localInstance.form_fields_setting}
							</div>
							<CpsFormFieldDetailEditing
								value={field}
								onChange={(field) => {
									onChange(field);
								}}
							/>
							<Popover.Close
								className="form--CpsFormFieldSettingPopoverClose"
								aria-label={localInstance.close}
							>
								<X size={14} />
							</Popover.Close>
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
				{props.children}
			</div>
		</div>
	);
}
