declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        textarea: {
            title: string;
            type: string;
        };
        "section-link": {
            title: string;
            type: string;
        };
        display: {
            title: string;
            const: string;
        };
        checkbox: {
            title: string;
            type: string;
        };
        button: {
            title: string;
            type: string;
        };
        array: {
            title: string;
            items: {
                title: string;
                type: string;
            };
        };
        "number-field": {
            title: string;
            type: string;
        };
        select: {
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
};
export default _default;
