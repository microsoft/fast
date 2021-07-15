declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        level: {
            title: string;
            type: string;
            enum: number[];
            default: number;
        };
        quantity: {
            title: string;
            type: string;
            examples: number[];
            minimum: number;
            maximum: number;
            multipleOf: number;
        };
        defaultNumber: {
            title: string;
            type: string;
            default: number;
        };
        optionalNumber: {
            title: string;
            type: string;
        };
        disabledNumber: {
            title: string;
            type: string;
            disabled: boolean;
        };
    };
    required: string[];
};
export default _default;
