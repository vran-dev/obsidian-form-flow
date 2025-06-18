import { ReactNode } from "react";
import { useActionTitle } from "src/hooks/useActionTitle";
import useFormConfig from "src/hooks/useFormConfig";
import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import "./ActionFlow.css";

type ActionNodeProps = {
	action: IFormAction;
	isLast: boolean;
};

const ActionNode = ({ action, isLast }: ActionNodeProps) => {
	const actionTitle = useActionTitle(action);

	return (
		<div className="form--ActionFlowNode">
			<div className="form--ActionFlowNodeContent">
				<div className="form--ActionFlowNodeType">
					{actionTitle.type}
				</div>
				{actionTitle.title && (
					<div className="form--ActionFlowNodeTitle">
						{actionTitle.title}
					</div>
				)}
			</div>

			{!isLast && (
				<div className="form--ActionFlowArrow">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M12 5L12 19"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<path
							d="M7 14L12 19L17 14"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			)}
		</div>
	);
};

type ActionFlowProps = {
	className?: string;
	emptyMessage?: ReactNode;
};

export const ActionFlow = ({ className, emptyMessage }: ActionFlowProps) => {
	const formConfig = useFormConfig();
	const actions = formConfig.actions || [];

	if (actions.length === 0) {
		return (
			<div
				className={`form--ActionFlow form--ActionFlowEmpty ${
					className || ""
				}`}
			>
				{emptyMessage || localInstance.no_actions_configured}
			</div>
		);
	}

	return (
		<div className={`form--ActionFlow ${className || ""}`}>
			<div className="form--ActionFlowNodes">
				{actions.map((action, index) => (
					<ActionNode
						key={index}
						action={action}
						isLast={index === actions.length - 1}
					/>
				))}
			</div>
		</div>
	);
};

export default ActionFlow;
