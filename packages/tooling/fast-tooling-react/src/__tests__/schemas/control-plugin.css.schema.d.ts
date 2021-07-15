declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        css: {
            title: string;
            type: string;
            formControlId: string;
        };
        object: {
            title: string;
            type: string;
            properties: {
                cssWithOverrides2: {
                    title: string;
                    type: string;
                    formControlId: string;
                };
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
