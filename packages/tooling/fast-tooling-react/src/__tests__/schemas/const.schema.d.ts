declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        foo: {
            title: string;
            type: string;
            const: string;
            default: string;
        };
        bar: {
            title: string;
            type: string;
            const: number;
        };
        bat: {
            title: string;
            type: string;
            const: boolean;
        };
    };
    required: string[];
};
export default _default;
