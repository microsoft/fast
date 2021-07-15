declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        boolean: {
            title: string;
            type: string;
            pluginId: string;
        };
        array: {
            title: string;
            type: string;
            pluginId: string;
            items: {
                title: string;
                type: string;
            };
        };
        arrayObject: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
                properties: {
                    content: {
                        pluginId: string;
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
        };
        render: {
            pluginId: string;
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
