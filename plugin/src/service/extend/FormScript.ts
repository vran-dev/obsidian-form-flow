export interface FormScript {
    id: string;
    name: string;
    description: Description;
    tags: string[];
    entry: Function;
}

/**
 * @sample { "zh":"", "en":"" }
 */
export type Description = string | Record<string, string>;

