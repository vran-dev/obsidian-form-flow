export class Objects {
    static exists(obj: any): boolean {
        return obj !== null && obj !== undefined;
    }

    static isNullOrUndefined(obj: any): boolean {
        return obj === null || obj === undefined;
    }
}