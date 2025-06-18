export class Strings {

    static isBlank(value: string | null | undefined): boolean {
        if (value === undefined) {
            return true;
        }
        if (value === null) {
            return true;
        }
        return value.trim() === "";
    }

    static isNotBlank(value: string | null | undefined): boolean {
        return !this.isBlank(value);
    }

    static isEmpty(value: string | null | undefined): boolean {
        if (value === undefined) {
            return true;
        }
        if (value === null) {
            return true;
        }
        return value.length === 0;
    }

    static isNotEmpty(v: string): boolean {
        return !this.isEmpty(v);
    }

    static defaultIfBlank(value: string | null | undefined, defaultValue: string): string {
        if (this.isBlank(value)) {
            return defaultValue;
        }
        return value!;
    }

    static defaultIfEmpty(value: string | null | undefined, defaultValue: string): string {
        if (this.isEmpty(value)) {
            return defaultValue;
        }
        return value!;
    }

    static isEmail(value: string | null | undefined) {
        if (this.isBlank(value)) {
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value!);
    }

    static isStartsWith(value: string | null | undefined, prefixList: string[]): boolean {
        if (this.isBlank(value)) {
            return false;
        }
        if (!Array.isArray(prefixList) || prefixList.length === 0) {
            return false;
        }
        for (const prefix of prefixList) {
            if (value!.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    static safeToLowerCaseString(value: any) {
        if (value === undefined || value === null) {
            return "";
        }

        if (value.toLowerCase) {
            return value.toLowerCase();
        }

        if (value.toString) {
            return value.toString().toLowerCase();
        }

        return value + "";
    }
}