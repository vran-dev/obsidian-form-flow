import { En } from "./en";
import { Local } from "./local";
import { Zh } from "./zh";
import { ZhTw } from "./zhTw";


export class Locals {
	static get(): Local {
		const lang = window.localStorage.getItem("language");
		// simplified chinese
		if (lang === "zh-CN" || lang === "zh") {
			return new Zh();
		}
		// traditional chinese
		if (lang === "zh-TW") {
			return new ZhTw();
		}
		return new En();
	}
}

export function isZh(): boolean {
	const lang = window.localStorage.getItem("language");
	return lang === "zh" || lang === 'zh-TW' || lang === 'zh-CN';
}

export const localInstance = Locals.get();
