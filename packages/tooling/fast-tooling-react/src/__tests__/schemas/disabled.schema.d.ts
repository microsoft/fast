declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    disabled: boolean;
    properties: {
        textarea: {
            title: string;
            type: string;
            disabled: boolean;
        };
        "section-link": {
            title: string;
            type: string;
            disabled: boolean;
        };
        display: {
            title: string;
            const: string;
            disabled: boolean;
        };
        checkbox: {
            title: string;
            type: string;
            disabled: boolean;
        };
        button: {
            title: string;
            type: string;
            disabled: boolean;
        };
        array: {
            title: string;
            items: {
                title: string;
                type: string;
                disabled: boolean;
            };
            disabled: boolean;
        };
        "number-field": {
            title: string;
            type: string;
            disabled: boolean;
        };
        select: {
            title: string;
            type: string;
            enum: string[];
            disabled: boolean;
        };
        children: {
            disabled: boolean;
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
