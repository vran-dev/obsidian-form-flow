import { localInstance } from "src/i18n/locals";
import { FormScript } from "src/service/extend/FormScript";

export default function ExtensionFunctionItem(props: {
	extension: FormScript;
	isActive: boolean;
	onMouseEnter: () => void;
	onClick: () => void;
}) {
	const { extension, isActive, onMouseEnter, onClick } = props;

	return (
		<div
			className={`form--ExtensionEditorFunctionItem ${
				isActive ? "active" : ""
			}`}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
			aria-label={extension.name}
		>
			<div className="form--ExtensionEditorFunctionName">
				{extension.name}
			</div>
			<div className="form--ExtensionEditorFunctionMenus">
				<span className="form--ExtensionEditorFunctionTag">
					{localInstance.extension}
				</span>
			</div>
		</div>
	);
}
