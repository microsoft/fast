declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        strings: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
            };
            minItems: number;
            maxItems: number;
        };
        objects: {
            title: string;
            type: string;
            items: {
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
        };
        stringsWithDefault: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
            };
            default: string[];
        };
        objectsWithDefault: {
            title: string;
            type: string;
            items: {
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
            default: {
                string: string;
            }[];
        };
    };
    required: string[];
};
export default _default;
