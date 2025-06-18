import { ToggleComponent } from "obsidian";
import { useRef, useLayoutEffect, useEffect } from "react";

export default function (props: {
	value: any;
	onValueChange: (value: any) => void;
	required?: boolean;
	id?: string;
	autoFocus?: boolean;
}) {
	const { value, onValueChange, id } = props;
	const containerRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<ToggleComponent | null>(null);
	useLayoutEffect(() => {
		if (!containerRef.current) {
			return;
		}
		const switchElement = containerRef.current;
		switchElement.empty();
		const el = new ToggleComponent(switchElement);
		el.toggleEl.id = id ?? "";
		el.toggleEl.autofocus = props.autoFocus || false;
		el.setValue(value);
		el.onChange(onValueChange);
		if (el.toggleEl instanceof HTMLInputElement) {
			el.toggleEl.required = props.required || false;
		}
		toggleRef.current = el;
		return () => {};
	}, [props.autoFocus, id, props.required]);

	useEffect(() => {
		if (toggleRef.current) {
			toggleRef.current.setValue(value);
		}
	}, [value]);
	useEffect(() => {
		if (toggleRef.current) {
			toggleRef.current.onChange(onValueChange);
		}
	}, [props.onValueChange]);

	return <div ref={containerRef}></div>;
}
