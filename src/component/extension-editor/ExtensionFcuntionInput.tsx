import { FunctionSquare, Folder } from "lucide-react";
import { Component, MarkdownRenderer } from "obsidian";
import { useRef, useEffect } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";
import { FormScript } from "src/service/extend/FormScript";
import locateFile from "src/utils/locateFile";

export default function ExtensionFcuntionInput(props: {
	extension: FormScript;
}) {
	const { extension } = props;
	const app = useObsidianApp();
	const extensionDetailRef = useRef<HTMLDivElement>(null);
	const obComponentRef = useRef(new Component());

	useEffect(() => {
		if (!extensionDetailRef.current) return;

		extensionDetailRef.current.empty();
		let description = "";
		if (typeof extension.description === "string") {
			description = extension.description;
		} else if (extension.description) {
			description =
				extension.description.zh ||
				extension.description.default ||
				extension.description.en ||
				"";
		}

		MarkdownRenderer.render(
			app,
			description,
			extensionDetailRef.current,
			"",
			obComponentRef.current
		);

		return () => {
			if (extensionDetailRef.current) {
				extensionDetailRef.current.empty();
			}
			obComponentRef.current.unload();
		};
	}, [extension, extensionDetailRef.current]);

	return (
		<div className="form--ExtensionEditorFunctionDetail">
			<div className="form--ExtensionEditorFunctionDetailHeader">
				<div className="form--ExtensionEditorFunctionDetailTitle">
					<FunctionSquare size={16} style={{ marginRight: "8px" }} />
					{extension.name}()
				</div>
			</div>

			<div className="form--ExtensionEditorFunctionDetailPath">
				<button
					aria-label={localInstance.locate_position_in_file_list}
					onClick={() => {
						locateFile(extension.id, app);
					}}
				>
					<Folder size={14} />
				</button>
				<a
					href={extension.id}
					data-href={extension.id}
					target="_blank"
					rel="noopener"
					className="internal-link"
				>
					{extension.id}
				</a>
			</div>

			<div
				className="form--ExtensionEditorFunctionDetailContent"
				ref={extensionDetailRef}
			/>
		</div>
	);
}
