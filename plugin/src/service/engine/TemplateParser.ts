import { FormState } from "../FormState";

export default class {

    static compile(text: string, state: FormState) {

        let result = '';
        let i = 0;

        while (i < text.length) {
            // 查找下一个 {{@ 表达式
            const startIdx = text.indexOf("{{@", i);
            if (startIdx === -1) {
                result += text.slice(i);
                break;
            }

            result += text.slice(i, startIdx);
            const endIdx = this.findClosingBrace(text, startIdx + 2);
            if (endIdx === -1) {
                result += text.slice(startIdx);
                break;
            }

            const expr = text.slice(startIdx + 3, endIdx);
            result += this.evaluateExpression(expr, state);

            i = endIdx + 2;
        }

        return result;
    }

    // 寻找匹配的结束括号
    private static findClosingBrace(text: string, startPos: number): number {
        let inString = false;
        let escape = false;

        // 从startPos位置开始查找，这个位置是第二个{后面
        for (let i = startPos + 1; i < text.length - 1; i++) {
            const char = text[i];

            if (escape) {
                escape = false;
                continue;
            }

            if (char === '\\') {
                escape = true;
                continue;
            }

            // 处理字符串引号
            if (char === '"' && !inString) {
                inString = true;
                continue;
            }

            if (char === '"' && inString) {
                inString = false;
                continue;
            }

            // 查找未转义且不在字符串内的 }} 序列
            if (!inString && char === '}' && text[i + 1] === '}') {
                return i; // 返回第一个 } 的位置
            }
        }

        return -1; // 未找到匹配的 }}
    }

    private static evaluateExpression(expr: string, state: FormState): string {
        const propertyName = expr;
        const value = state.values[propertyName];
        if (value === undefined || value === null) {
            return "";
        }
        return String(value);
    }

}