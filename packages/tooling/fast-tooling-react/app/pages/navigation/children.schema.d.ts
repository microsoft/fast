declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        object: {
            title: string;
            type: string;
            properties: {
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
        array: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
                properties: {
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
