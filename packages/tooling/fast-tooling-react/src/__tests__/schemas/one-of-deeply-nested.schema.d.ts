declare const _default: {
    $schema: string;
    title: string;
    type: string;
    id: string;
    properties: {
        propertyKey: {
            title: string;
            oneOf: {
                title: string;
                type: string;
                properties: {
                    propertyKey1: {
                        title: string;
                        type: string;
                        properties: {
                            propertyKey2: {
                                title: string;
                                type: string;
                                oneOf: {
                                    title: string;
                                    type: string;
                                    description: string;
                                    properties: {
                                        foo: {
                                            title: string;
                                            type: string;
                                            enum: string[];
                                        };
                                        bar: {
                                            title: string;
                                            type: string;
                                            enum: string[];
                                        };
                                    };
                                }[];
                            };
                        };
                    };
                };
                required: string[];
            }[];
        };
    };
};
export default _default;
