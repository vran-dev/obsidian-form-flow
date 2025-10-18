import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {
	CircleAlert,
	ChevronDown,
	ChevronRight,
	Copy,
	Trash2,
	Network,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useActionTitle } from "src/hooks/useActionTitle";
import { useActionTypeStyle } from "src/hooks/useActionTypeStyle";
import { useActionValidation } from "src/hooks/useActionValidation";
import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { Filter, FilterType } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { FormCondition } from "src/view/shared/filter-content/FormCondition";
import { v4 } from "uuid";
import ActionTypeSelect from "./common/ActionTypeSelect";
import CpsFormActionDetailSetting from "./CpsFormActionDetailSetting";
import useSortableItem from "src/hooks/useSortableItem";
import { ConfirmPopover } from "src/component/confirm/ConfirmPopover";
import { DragHandler } from "src/component/drag-handler/DragHandler";
import Dialog2 from "src/component/dialog/Dialog2";
import { FilterRoot } from "src/component/filter/FilterRoot";
import "./CpsFormAction.css";

export default function (props: {
	value: IFormAction;
	onChange: (action: IFormAction) => void;
	onDelete: (action: IFormAction) => void;
	onDuplicate: (action: IFormAction) => void;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(props.defaultOpen === true);
	const { value, onDelete, onDuplicate } = props;
	const { closestEdge, dragging, draggedOver, setElRef, setDragHandleRef } =
		useSortableItem(value.id);
	const saveAction = (action: IFormAction) => {
		props.onChange(action);
	};
	const result = useActionValidation(value);
	const heading = useActionTitle(value);

	const title = useMemo(() => {
		return heading.title;
	}, [heading.title]);

	const [openCondition, setOpenCondition] = useState(false);
	const condition: Filter = value.condition ?? {
		id: v4(),
		type: FilterType.group,
		operator: OperatorType.And,
		conditions: [],
	};

	const fieldConditionLength = useMemo(() => {
		if (!value.condition) {
			return 0;
		}
		if (!value.condition.conditions) {
			return 0;
		}
		return value.condition.conditions.length;
	}, [value.condition]);
	return (
		<div
			className="form--CpsFormActionSetting"
			data-is-valid={result.isValid}
			ref={setElRef}
		>
			{!result.isValid && (
				<span className="form--CpsFormActionErrorTips">
					<CircleAlert size={16} />
					{result.validationMessages[0] || ""}
				</span>
			)}
			<CpsFormActionHeader
				title={title}
				value={value}
				open={open}
				onOpenChange={setOpen}
				onChange={saveAction}
				onDelete={onDelete}
				onDuplicate={onDuplicate}
				setDragHandleRef={setDragHandleRef}
			/>
			<div className="form--CpsFormActionBottomSection">
				<div className="form--CpsFormActionRemark">
					{value.remark && (
						<span className="form--CpsFormActionRemarkText">
							{value.remark}
						</span>
					)}
				</div>
				<div className="form--CpsFormActionCondition">
					<button
						className="form--VisibilityConditionButton"
						data-has-condition={fieldConditionLength > 0}
						onClick={() => {
							setOpenCondition(true);
						}}
					>
						<Network size={14} />
						{localInstance.execute_condition}
						{fieldConditionLength > 0 && ` + ${fieldConditionLength}`}
					</button>
				</div>
			</div>

			{open && (
				<div className="form--CpsFormActionContent">
					<CpsFormActionDetailSetting
						value={value}
						onChange={saveAction}
					/>
				</div>
			)}
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
								const newValue = {
									...value,
									condition: filter,
								};
								saveAction(newValue);
							}}
							filterContentComponent={FormCondition}
						/>
					);
				}}
			</Dialog2>
			{closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
		</div>
	);
}

function CpsFormActionHeader(props: {
	title: React.ReactNode;
	value: IFormAction;
	open: boolean;
	onChange: (action: IFormAction) => void;
	onOpenChange: (open: boolean) => void;
	onDelete: (action: IFormAction) => void;
	onDuplicate: (action: IFormAction) => void;
	setDragHandleRef: (ref: HTMLDivElement | null) => void;
}) {
	const { value, open, setDragHandleRef, title } = props;

	const typeStyles = useActionTypeStyle(value.type);

	return (
		<div
			className="form--CpsFormActionHeader"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					props.onOpenChange(!open);
				}
			}}
		>
			<DragHandler
				ref={setDragHandleRef}
				aria-label={localInstance.drag_and_drop_to_reorder}
			/>

			<ActionTypeSelect
				value={value.type}
				styles={typeStyles}
				onChange={(type) => {
					const newAction = {
						...value,
						type: type,
					};
					props.onChange(newAction);
				}}
			/>
			<div
				className="form--CpsFormActionHeaderTitle"
				onClick={(e) => {
					if (e.target === e.currentTarget) {
						props.onOpenChange(!open);
					}
				}}
			>
				{title}
			</div>
			<div className="form--CpsFormActionHeaderControl">
				<button
					className="clickable-icon"
					aria-label={
						open ? localInstance.fold : localInstance.expand
					}
					onClick={() => props.onOpenChange(!open)}
				>
					{open ? (
						<ChevronDown size={14} />
					) : (
						<ChevronRight size={14} />
					)}
				</button>
				<button
					className="clickable-icon"
					aria-label={localInstance.duplicate}
					onClick={() => props.onDuplicate(value)}
				>
					<Copy />
				</button>
				<ConfirmPopover
					onConfirm={() => {
						props.onDelete(value);
					}}
					title={localInstance.confirm_to_delete}
				>
					<button
						className="clickable-icon"
						data-type="danger"
						aria-label={localInstance.delete}
					>
						<Trash2 size={14} />
					</button>
				</ConfirmPopover>
			</div>
		</div>
	);
}
