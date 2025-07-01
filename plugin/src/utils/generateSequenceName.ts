import { localInstance } from "src/i18n/locals";

export default function (sequences: string[], prefix?: string) {
    let name = prefix || localInstance.unnamed;
    for (let suffix = 1; suffix < 10000; suffix++) {
        const exists = sequences.includes(name);
        if (!exists) {
            break;
        }
        name = (prefix || localInstance.unnamed) + " " + suffix;
    }
    return name;
}