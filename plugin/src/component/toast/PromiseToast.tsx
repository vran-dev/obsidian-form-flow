import React, { useEffect, useRef, useState } from "react";
import { Toast } from "./Toast";
import { localInstance } from "src/i18n/locals";

export function PromiseToastView<T>({
	promise,
	loadingMessage = localInstance.handling,
	successMessage = localInstance.submit_success,
	renderError = (err) => (
		<>
			<strong>{localInstance.submit_failed}</strong>
			<p>{err.message || localInstance.unknown_error}</p>
		</>
	),
}: {
	promise: Promise<T>;
	loadingMessage?: React.ReactNode;
	successMessage?: React.ReactNode;
	renderError?: (error: Error) => React.ReactNode;
}) {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const errorRef = useRef<Error | null>(null);

	useEffect(() => {
		promise
			.then(() => {
				setStatus("success");
			})
			.catch((err) => {
				errorRef.current = err;
				setStatus("error");
			});
	}, [promise]);

	if (status === "loading") {
		return <>{loadingMessage}</>;
	}

	if (status === "error" && errorRef.current) {
		return <>{renderError(errorRef.current)}</>;
	}

	return <>{successMessage}</>;
}

export class PromiseToast<T> {
	private toast: Toast | null = null;

	constructor(
		public promise: Promise<T>,
		public options: {
			loadingMessage?: React.ReactNode;
			successMessage?: React.ReactNode;
			renderError?: (error: Error) => React.ReactNode;
			successDuration?: number;
		} = {}
	) {
		this.show();
	}

	private show() {
		// 创建基础 Toast
		this.toast = new Toast(
			{
				content: (
					<PromiseToastView
						promise={this.promise
							.then((result) => {
								if (this.toast) {
									this.toast.updateType("success");
									setTimeout(() => {
										this.remove();
									}, this.options.successDuration ?? 3000);
								}
								return result;
							})
							.catch((err) => {
								if (this.toast) {
									this.toast.updateType("error");
								}
								throw err;
							})}
						loadingMessage={this.options.loadingMessage}
						successMessage={this.options.successMessage}
						renderError={this.options.renderError}
					/>
				),
				duration: 0,
			},
			"loading"
		);
	}

	remove() {
		if (this.toast) {
			this.toast.remove();
			this.toast = null;
		}
	}
}

// 简化创建 PromiseToast 的工厂函数
export function showPromiseToast<T>(
	promise: Promise<T>,
	options: {
		loadingMessage?: React.ReactNode;
		successMessage?: React.ReactNode;
		renderError?: (error: Error) => React.ReactNode;
		successDuration?: number;
	} = {}
): PromiseToast<T> {
	return new PromiseToast(promise, options);
}
