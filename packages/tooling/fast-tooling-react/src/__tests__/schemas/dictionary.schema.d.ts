declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    propertyTitle: string;
    properties: {
        additionalObjects: {
            title: string;
            type: string;
            additionalProperties: {
                title: string;
                type: string;
                properties: {
                    foo: {
                        type: string;
                    };
                };
            };
        };
        additionalFalse: {
            title: string;
            type: string;
            properties: {};
            additionalProperties: boolean;
        };
    };
    additionalProperties: {
        title: string;
        type: string;
    };
};
export default _default;
