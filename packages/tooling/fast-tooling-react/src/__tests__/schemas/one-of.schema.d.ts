declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    oneOf: ({
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            string: {
                title: string;
                type: string;
            };
            number?: undefined;
            numberOrString?: undefined;
            foo?: undefined;
        };
        required: string[];
        title?: undefined;
        formConfig?: undefined;
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
            numberOrString?: undefined;
            foo?: undefined;
        };
        required: string[];
        title?: undefined;
        formConfig?: undefined;
    } | {
        title: string;
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            numberOrString: {
                title: string;
                oneOf: ({
                    title: string;
                    type: string;
                    additionalProperties?: undefined;
                    properties?: undefined;
                    required?: undefined;
                    items?: undefined;
                } | {
                    title: string;
                    type: string;
                    additionalProperties: boolean;
                    properties: {
                        object: {
                            title: string;
                            type: string;
                            properties: {
                                number: {
                                    title: string;
                                    type: string;
                                };
                            };
                            required: string[];
                        };
                        children?: undefined;
                    };
                    required: string[];
                    items?: undefined;
                } | {
                    title: string;
                    type: string;
                    items: {
                        title: string;
                        oneOf: {
                            title: string;
                            type: string;
                        }[];
                    };
                    additionalProperties?: undefined;
                    properties?: undefined;
                    required?: undefined;
                } | {
                    title: string;
                    type: string;
                    additionalProperties: boolean;
                    properties: {
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
                        object?: undefined;
                    };
                    required?: undefined;
                    items?: undefined;
                })[];
            };
            string?: undefined;
            number?: undefined;
            foo?: undefined;
        };
        required: string[];
        formConfig?: undefined;
    } | {
        description: string;
        type: string;
        additionalProperties: boolean;
        properties: {
            foo: {
                title: string;
                type: string;
            };
            string?: undefined;
            number?: undefined;
            numberOrString?: undefined;
        };
        required: string[];
        formConfig: {
            categories: {
                title: string;
                expandable: boolean;
                items: string[];
            }[];
        };
        title?: undefined;
    })[];
};
export default _default;
