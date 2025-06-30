export interface DemoConfig {
    id: string;
    icon: string;
    titleId: string;
    descriptionId: string;
    fields: Array<DemoField>;
    action: string;
}

export interface DemoField {
    label: string;
    value: string;
    type: 'text' | 'select' | 'radio' | 'textarea';
    options?: string[]; // Only used for select and radio types
}