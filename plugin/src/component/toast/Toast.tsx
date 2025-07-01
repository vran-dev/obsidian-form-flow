import React from "react";
import { createRoot, Root } from "react-dom/client";
import { v4 } from "uuid";
import "./Toast.css";
import { ToastView } from "./ToastView";

export type ToastProps = {
	content: React.ReactNode;
	duration?: number; // 自动关闭时间，单位毫秒，0 表示不自动关闭
	onClose?: () => void;
};

export type ToastType =
	| "default"
	| "success"
	| "error"
	| "info"
	| "warning"
	| "loading";

export class Toast {
	private root: Root | null = null;
	private container: HTMLElement | null = null;
	private toastId: string = v4();
	private isRemoving = false;
	private removeTimeoutId: number | null = null;
	private autoCloseTimeoutId: number | null = null;

	constructor(public props: ToastProps, public type: ToastType = "default") {
		this.open();
	}

	private open() {
		const doc = window.activeWindow.activeDocument;
		this.container = doc.createElement("div");
		this.container.className = `form--Toast ${this.type} visible`;
		this.container.id = this.toastId;
		doc.body.appendChild(this.container);

		this.root = createRoot(this.container);
		this.root.render(
			<ToastView
				content={this.props.content}
				onClose={() => this.remove()}
				type={this.type}
			/>
		);

		// 自动关闭
		if (this.props.duration !== undefined && this.props.duration > 0) {
			this.autoCloseTimeoutId = window.setTimeout(() => {
				this.remove();
			}, this.props.duration);
		}
	}

	updateType(type: ToastType) {
		if (this.container) {
			// 移除所有类型类
			this.container.classList.remove(
				"default",
				"success",
				"error",
				"info",
				"warning",
				"loading"
			);
			// 添加新类型类
			this.container.classList.add(type);

			// 重新渲染以更新图标
			if (this.root && this.container) {
				this.root.render(
					<ToastView
						content={this.props.content}
						onClose={() => this.remove()}
						type={type}
					/>
				);
			}
		}
	}

	remove() {
		if (this.isRemoving) return;
		this.isRemoving = true;

		// 清除自动关闭计时器
		if (this.autoCloseTimeoutId) {
			window.clearTimeout(this.autoCloseTimeoutId);
			this.autoCloseTimeoutId = null;
		}

		if (this.container) {
			this.container.classList.remove("visible");

			if (this.removeTimeoutId) {
				window.clearTimeout(this.removeTimeoutId);
			}

			this.removeTimeoutId = window.setTimeout(() => {
				if (this.root) {
					try {
						this.root.unmount();
					} catch (e) {
						console.error("Error unmounting toast root:", e);
					}
					this.root = null;
				}

				if (this.container) {
					this.container.remove();
					this.container = null;
				}

				// 触发关闭回调
				if (this.props.onClose) {
					this.props.onClose();
				}

				this.removeTimeoutId = null;
			}, 300); // 等待淡出动画完成
		}
	}
}
