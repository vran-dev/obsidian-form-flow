import { Toast } from "./Toast";

export const ToastManager = {
	show(content: React.ReactNode, duration: number = 3000): Toast {
		return new Toast({ content, duration });
	},

	success(content: React.ReactNode, duration: number = 3000): Toast {
		return new Toast({ content, duration }, "success");
	},

	error(content: React.ReactNode, duration: number = 0): Toast {
		return new Toast({ content, duration }, "error");
	},

	info(content: React.ReactNode, duration: number = 3000): Toast {
		return new Toast({ content, duration }, "info");
	},

	warning(content: React.ReactNode, duration: number = 3000): Toast {
		return new Toast({ content, duration }, "warning");
	},

	loading(content: React.ReactNode, duration: number = 0): Toast {
		return new Toast({ content, duration }, "loading");
	},
};
