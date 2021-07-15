declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        a: {
            title: string;
            type: string;
            default: string;
        };
        b: {
            title: string;
            type: string;
        };
        c: {
            title: string;
            type: string;
            properties: {
                alpha: {
                    title: string;
                    type: string;
                    default: string;
                };
                beta: {
                    title: string;
                    type: string;
                };
            };
            default: {
                alpha: string;
                beta: string;
            };
        };
        d: {
            title: string;
            type: string;
            properties: {
                alpha: {
                    title: string;
                    type: string;
                    default: string;
                };
                beta: {
                    title: string;
                    type: string;
                };
            };
        };
        e: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
                default: string;
            };
            default: string[];
        };
        f: {
            title: string;
            type: string;
            enum: string[];
            default: string;
        };
        g: {
            title: string;
            type: string;
            default: boolean;
        };
        h: {
            title: string;
            type: string;
            default: string;
            const: string;
        };
        i: {
            title: string;
            type: string;
            default: any;
        };
    };
    default: {
        a: string;
        b: string;
        c: {
            alpha: string;
            beta: string;
        };
        d: {
            alpha: string;
            beta: string;
        };
        e: string[];
    };
};
export default _default;
