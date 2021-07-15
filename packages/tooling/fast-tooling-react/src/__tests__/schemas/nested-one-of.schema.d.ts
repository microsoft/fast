declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        single: {
            title: string;
            type: string;
            oneOf: {
                title: string;
                description: string;
                type: string;
                properties: {
                    omega: {
                        title: string;
                        type: string;
                    };
                    alpha: {
                        title: string;
                        type: string;
                        properties: {
                            beta: {
                                title: string;
                                type: string;
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
