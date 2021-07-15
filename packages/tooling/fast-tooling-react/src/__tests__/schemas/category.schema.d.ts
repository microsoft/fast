declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    $id: string;
    id: string;
    properties: {
        string: {
            title: string;
            type: string;
        };
        boolean: {
            title: string;
            type: string;
        };
        enum: {
            title: string;
            type: string;
            enum: string[];
        };
        number: {
            title: string;
            type: string;
        };
        object: {
            title: string;
            type: string;
            properties: {
                number: {
                    type: string;
                };
                string: {
                    type: string;
                };
            };
        };
        array: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
            };
        };
        children: {
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
            title: string;
        };
    };
};
export default _default;
