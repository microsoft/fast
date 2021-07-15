declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
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
        optionalObjectWithNestedObject: {
            title: string;
            type: string;
            properties: {
                nestedObject: {
                    title: string;
                    type: string;
                    properties: {
                        boolean: {
                            type: string;
                        };
                    };
                };
            };
        };
        optionalObjectWithDefaultValue: {
            title: string;
            type: string;
            properties: {
                foo: {
                    type: string;
                };
            };
            default: {
                foo: string;
            };
        };
        optionalObjectDisabled: {
            title: string;
            type: string;
            disabled: boolean;
            properties: {
                foo: {
                    title: string;
                    type: string;
                };
                bar: {
                    title: string;
                    type: string;
                };
            };
            default: {
                foo: string;
            };
        };
    };
    required: string[];
};
export default _default;
