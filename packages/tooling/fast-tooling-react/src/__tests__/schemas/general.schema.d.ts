declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        title: {
            title: string;
            type: string;
        };
        toggle: {
            title: string;
            type: string;
        };
        details: {
            title: string;
            type: string;
        };
        toggle2: {
            title: string;
            type: string;
        };
        tag: {
            title: string;
            type: string;
            enum: string[];
            default: string;
        };
        level: {
            title: string;
            type: string;
            examples: number[];
        };
        text: {
            title: string;
            type: string;
            examples: string[];
        };
        alignHorizontal: {
            title: string;
            type: string;
            enum: string[];
        };
        alignVertical: {
            title: string;
            type: string;
            enum: string[];
        };
        level2: {
            title: string;
            type: string;
            examples: number[];
        };
        objectNoRequired: {
            title: string;
            type: string;
            properties: {
                number: {
                    type: string;
                };
            };
        };
        objectWithRequired: {
            title: string;
            type: string;
            properties: {
                boolean: {
                    type: string;
                };
            };
            required: string[];
        };
        optionalObjectWithRequired: {
            title: string;
            type: string;
            properties: {
                string: {
                    type: string;
                };
            };
            required: string[];
        };
        optionalObjectNoRequired: {
            title: string;
            type: string;
            properties: {
                boolean: {
                    type: string;
                };
            };
        };
        strings: {
            title: string;
            type: string;
            items: {
                type: string;
            };
            minItems: number;
            maxItems: number;
        };
        theme: {
            title: string;
            type: string;
            enum: string[];
        };
        children: {
            [x: string]: string | boolean | {
                type: string;
                properties: {
                    id: {
                        title: string;
                        type: string;
                    };
                    dataLocation: {
                        title: string;
                        type: string;
                    };
                };
            };
            type: string;
            items: {
                type: string;
                properties: {
                    id: {
                        title: string;
                        type: string;
                    };
                    dataLocation: {
                        title: string;
                        type: string;
                    };
                };
            };
        };
    };
    required: string[];
};
export default _default;
