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
        text: {
            title: string;
            type: string;
            examples: string[];
        };
    };
    required: string[];
};
export default _default;
