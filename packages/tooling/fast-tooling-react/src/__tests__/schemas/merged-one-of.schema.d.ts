declare const _default: {
    $schema: string;
    type: string;
    id: string;
    title: string;
    properties: {
        foo: {
            title: string;
            type: string;
            required: string[];
            oneOf: {
                title: string;
                description: string;
                properties: {
                    a: {
                        title: string;
                        type: string;
                    };
                    b: {
                        title: string;
                        type: string;
                    };
                };
            }[];
        };
    };
};
export default _default;
