declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    anyOf: ({
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            string: {
                title: string;
                type: string;
            };
            number?: undefined;
            subObjectAlpha?: undefined;
            subObjectBeta?: undefined;
            nestedAnyOf?: undefined;
            numberOrString?: undefined;
        };
        title?: undefined;
        required?: undefined;
    } | {
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            number: {
                title: string;
                type: string;
            };
            string?: undefined;
            subObjectAlpha?: undefined;
            subObjectBeta?: undefined;
            nestedAnyOf?: undefined;
            numberOrString?: undefined;
        };
        title?: undefined;
        required?: undefined;
    } | {
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            subObjectAlpha: {
                title: string;
                type: string;
                properties: {
                    foo: {
                        title: string;
                        type: string;
                    };
                };
            };
            string?: undefined;
            number?: undefined;
            subObjectBeta?: undefined;
            nestedAnyOf?: undefined;
            numberOrString?: undefined;
        };
        title?: undefined;
        required?: undefined;
    } | {
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            subObjectBeta: {
                title: string;
                type: string;
                properties: {
                    bar: {
                        title: string;
                        type: string;
                    };
                };
            };
            string?: undefined;
            number?: undefined;
            subObjectAlpha?: undefined;
            nestedAnyOf?: undefined;
            numberOrString?: undefined;
        };
        title?: undefined;
        required?: undefined;
    } | {
        title: string;
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            nestedAnyOf: {
                title: string;
                description: string;
                anyOf: ({
                    description: string;
                    type: string;
                    properties: {
                        object: {
                            title: string;
                            type: string;
                            properties: {
                                string: {
                                    title: string;
                                    type: string;
                                };
                            };
                            required: string[];
                        };
                        string?: undefined;
                        number?: undefined;
                    };
                    required: string[];
                } | {
                    description: string;
                    type: string;
                    properties: {
                        string: {
                            title: string;
                            type: string;
                        };
                        object?: undefined;
                        number?: undefined;
                    };
                    required: string[];
                } | {
                    description: string;
                    type: string;
                    properties: {
                        number: {
                            title: string;
                            type: string;
                        };
                        object?: undefined;
                        string?: undefined;
                    };
                    required: string[];
                })[];
            };
            string?: undefined;
            number?: undefined;
            subObjectAlpha?: undefined;
            subObjectBeta?: undefined;
            numberOrString?: undefined;
        };
        required?: undefined;
    } | {
        additionalProperties: boolean;
        description: string;
        type: string;
        properties: {
            numberOrString: {
                anyOf: ({
                    title: string;
                    type: string;
                    items?: undefined;
                } | {
                    title: string;
                    type: string;
                    items: {
                        title: string;
                        type: string;
                        anyOf?: undefined;
                    };
                } | {
                    title: string;
                    type: string;
                    items: {
                        anyOf: ({
                            additionalProperties: boolean;
                            title: string;
                            type: string;
                            properties: {
                                string: {
                                    title: string;
                                    type: string;
                                };
                            };
                        } | {
                            title: string;
                            type: string;
                            additionalProperties?: undefined;
                            properties?: undefined;
                        })[];
                        title?: undefined;
                        type?: undefined;
                    };
                })[];
            };
            string?: undefined;
            number?: undefined;
            subObjectAlpha?: undefined;
            subObjectBeta?: undefined;
            nestedAnyOf?: undefined;
        };
        required: string[];
        title?: undefined;
    })[];
};
export default _default;
