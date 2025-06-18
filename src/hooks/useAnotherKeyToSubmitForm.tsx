import { useEffect } from "react";

export function useAnotherKeyToSubmitForm(
	submitForm: () => void,
	settingRef: React.RefObject<HTMLDivElement>,
	formRef: React.RefObject<HTMLFormElement>
) {
	useEffect(() => {
		if (!settingRef.current || !formRef.current) {
			return;
		}
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				formRef.current?.requestSubmit();
				return;
			}
		};
		const formElement = settingRef.current;
		formElement.addEventListener("keydown", handleKeyDown);
		return () => {
			formElement.removeEventListener("keydown", handleKeyDown);
		};
	}, [submitForm]);
}
