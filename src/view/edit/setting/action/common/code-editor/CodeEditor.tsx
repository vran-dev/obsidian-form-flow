import { basicSetup } from "@codemirror/basic-setup";
import {
	defaultKeymap,
	history,
	historyKeymap,
	indentWithTab,
} from "@codemirror/commands";

import {
	bracketMatching,
	defaultHighlightStyle,
	indentOnInput,
	syntaxHighlighting,
} from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import {
	drawSelection,
	EditorView,
	highlightSpecialChars,
	keymap,
	lineNumbers,
} from "@codemirror/view";
import { useEffect, useRef, useState } from "react";
import "./CodeEditor.css";

type CodeEditorProps = {
	initialValue?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	height?: string;
	readOnly?: boolean;
	language?: string;
	extensions?: Extension[];
	extensionsKey?: string | number; // 添加一个键来标识扩展变更
};

export default function CodeEditor({
	initialValue = "",
	onChange,
	placeholder = "// Enter your JavaScript code here...",
	height = "250px",
	readOnly = false,
	language = "javascript",
	extensions = [],
	extensionsKey = "default", // 默认键
}: CodeEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const editorViewRef = useRef<EditorView>();
	const [isEditorInitialized, setIsEditorInitialized] = useState(false);
	const onChangeRef = useRef(onChange);
	const dynamicExtensionsCompartment = useRef(new Compartment());
	const languageExtensionCompartment = useRef(new Compartment());
	const prevExtensionsKeyRef = useRef(extensionsKey);

	// 更新 onChange 引用
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	const notifyChange = (newContent: string) => {
		if (onChangeRef.current) {
			onChangeRef.current(newContent);
		}
	};

	// 初始化编辑器
	useEffect(() => {
		if (!editorRef.current) return;

		// 如果编辑器已初始化且内容变更，更新内容
		if (editorViewRef.current && isEditorInitialized) {
			const currentContent = editorViewRef.current.state.doc.toString();
			if (currentContent !== initialValue) {
				editorViewRef.current.dispatch({
					changes: {
						from: 0,
						to: currentContent.length,
						insert: initialValue,
					},
				});
			}
			return;
		}

		if (editorViewRef.current) {
			editorViewRef.current.destroy();
		}

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				const newContent = update.state.doc.toString();
				notifyChange(newContent);
			}
		});

		if (language === "javascript") {
			import("@codemirror/lang-javascript")
				.then((jsModule) => {
					if (editorViewRef.current) {
						const jsExtension = jsModule.javascript();
						editorViewRef.current.dispatch({
							effects:
								languageExtensionCompartment.current.reconfigure(
									[jsExtension]
								),
						});
					}
				})
				.catch((e) => {
					console.error(
						"Failed to load JavaScript language support:",
						e
					);
				});
		} else if (language === "markdown") {
			Promise.all([
				import("@codemirror/lang-markdown"),
				import("@codemirror/lang-yaml"),
			])
				.then(([markdownModule, yamlModule]) => {
					if (editorViewRef.current) {
						const ext = yamlModule.yamlFrontmatter({
							content: markdownModule.markdown(),
						});
						editorViewRef.current.dispatch({
							effects:
								languageExtensionCompartment.current.reconfigure(
									[ext]
								),
						});
					}
				})
				.catch((e) => {
					console.error(
						"Failed to load Markdown language support:",
						e
					);
				});
		}

		const state = EditorState.create({
			doc: initialValue,
			extensions: [
				basicSetup,
				lineNumbers(),
				highlightSpecialChars(),
				history(),
				drawSelection(),
				languageExtensionCompartment.current.of([]),
				indentOnInput(),
				syntaxHighlighting(defaultHighlightStyle),
				bracketMatching(),
				keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
				updateListener,
				dynamicExtensionsCompartment.current.of(extensions),
				EditorView.editable.of(!readOnly),
				EditorView.domEventHandlers({
					keydown: (event) => {
						if (event.key === "Tab") {
							event.preventDefault();
							return false;
						}
						return false;
					},
				}),
			],
		});

		const view = new EditorView({
			state,
			parent: editorRef.current,
		});

		editorViewRef.current = view;
		setIsEditorInitialized(true);
		prevExtensionsKeyRef.current = extensionsKey;

		editorRef.current.tabIndex = -1;

		return () => {
			if (editorViewRef.current) {
				editorViewRef.current.destroy();
				setIsEditorInitialized(false);
			}
		};
	}, [placeholder, readOnly, language]);

	// 处理初始值变更
	useEffect(() => {
		if (!editorViewRef.current || !isEditorInitialized) return;

		const currentContent = editorViewRef.current.state.doc.toString();

		if (initialValue !== currentContent) {
			editorViewRef.current.dispatch({
				changes: {
					from: 0,
					to: currentContent.length,
					insert: initialValue,
				},
			});
		}
	}, [initialValue]);

	// 处理扩展变更 - 关键部分
	useEffect(() => {
		if (!editorViewRef.current || !isEditorInitialized) return;

		// 只有当扩展键变化时才更新扩展
		if (extensionsKey !== prevExtensionsKeyRef.current) {
			// 保存当前选择和滚动位置
			const selection = editorViewRef.current.state.selection;
			const scrollTop = editorViewRef.current.scrollDOM.scrollTop;

			editorViewRef.current.dispatch({
				effects:
					dynamicExtensionsCompartment.current.reconfigure(
						extensions
					),
			});

			editorViewRef.current.dispatch({
				selection: selection,
			});
			editorViewRef.current.scrollDOM.scrollTop = scrollTop;

			prevExtensionsKeyRef.current = extensionsKey;
		}
	}, [extensions, extensionsKey]);

	const handleContainerKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Tab") {
			event.preventDefault();
		}
	};

	return (
		<div
			className="form--codeEditorContainer"
			style={{ height }}
			onKeyDown={handleContainerKeyDown}
		>
			<div
				ref={editorRef}
				className="form--codeEditor"
				data-placeholder={placeholder}
			/>
		</div>
	);
}
