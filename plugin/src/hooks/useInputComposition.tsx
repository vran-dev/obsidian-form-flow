import { useRef } from "react";

export default function () {
	const isCompositionRef = useRef(false);
	const onCompositionStart = () => {
		isCompositionRef.current = true;
	};

	const onCompositionEnd = () => {
		isCompositionRef.current = false;
	};
	return {
		isCompositionRef,
		onCompositionStart,
		onCompositionEnd,
	};
}
