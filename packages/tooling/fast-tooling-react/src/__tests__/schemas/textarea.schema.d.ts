declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        tag: {
            title: string;
            type: string;
            enum: string[];
            default: string;
        };
        textWithExamples: {
            title: string;
            type: string;
            examples: string[];
        };
        textWithDefault: {
            title: string;
            type: string;
            default: string;
        };
        optionalTextWithExamples: {
            title: string;
            type: string;
            examples: string[];
        };
        optionalTextWithDefault: {
            title: string;
            type: string;
            default: string;
        };
        optionalTag: {
            title: string;
            type: string;
            enum: string[];
            default: string;
        };
        disabledTag: {
            title: string;
            type: string;
            enum: string[];
            default: string;
            disabled: boolean;
        };
        disabledText: {
            title: string;
            type: string;
            examples: string[];
            disabled: boolean;
        };
    };
    required: string[];
};
export default _default;
