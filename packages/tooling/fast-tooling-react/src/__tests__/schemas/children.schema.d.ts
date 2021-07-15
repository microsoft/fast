declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        objectContainingNestedChildren: {
            title: string;
            type: string;
            properties: {
                nestedObjectChildren: {
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
        arrayContainingNestedChildren: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
                properties: {
                    nestedArrayChildren: {
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
            formControlId: string;
            defaults: string[];
            examples: string[];
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
        restrictedWithChildren: {
            ids: string[];
            defaults: string[];
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
        restrictedChildrenWithReactDefaults: {
            ids: string[];
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
