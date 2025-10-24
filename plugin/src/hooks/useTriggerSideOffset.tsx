import React from "react";

export function useTriggerSideOffset(
	triggerRef: React.RefObject<HTMLElement>
): number {
	const [offset, setOffset] = React.useState(16);
	React.useEffect(() => {
		if (triggerRef.current) {
			const triggerRect = triggerRef.current.getBoundingClientRect();
			setOffset(triggerRect.height);
		}
	}, [triggerRef]);
	return offset;
}
