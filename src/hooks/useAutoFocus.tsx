import { useEffect } from "react";

const FOCUSABLE_SELECTOR = "input, select, textarea, button, [tabindex]";
export function useAutoFocus(
	containerRef: React.RefObject<HTMLElement>,
	delay?: number
) {
	useEffect(() => {
		const timer = setTimeout(() => {
			if (containerRef.current) {
				const focusableElements =
					containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
				// 过滤可见且可操作的元素
				const validElements = Array.from(focusableElements).filter(
					// @ts-ignore
					(el) => !el.disabled && el.offsetParent !== null
				);
				if (validElements.length > 0) {
					// @ts-ignore
					validElements[0].focus && validElements[0].focus();
				}
			}
		}, delay ?? 0);
		return () => clearTimeout(timer);
	}, [containerRef]);
}
