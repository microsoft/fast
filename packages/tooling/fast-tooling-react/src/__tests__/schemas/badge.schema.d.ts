declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        string: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
        };
        boolean: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
        };
        enum: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            enum: string[];
        };
        number: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
        };
        object: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            properties: {
                number: {
                    type: string;
                };
            };
        };
        array: {
            title: string;
            type: string;
            badge: string;
            badgeDescription: string;
            items: {
                title: string;
                type: string;
            };
        };
        stringWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            default: string;
        };
        booleanWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            default: boolean;
        };
        enumWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            enum: string[];
            default: string;
        };
        numberWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            default: number;
        };
        objectWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            properties: {
                number: {
                    type: string;
                };
            };
            default: {
                number: number;
            };
        };
        arrayWithDefault: {
            title: string;
            type: string;
            badge: string;
            badgeDescription: string;
            items: {
                title: string;
                type: string;
            };
            default: string[];
        };
        constWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            const: string;
            default: string;
        };
        selectWithSingleItemWithDefault: {
            title: string;
            badge: string;
            badgeDescription: string;
            type: string;
            enum: string[];
            default: string;
        };
        children: {
            badge: string;
            badgeDescription: string;
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
        childrenWithDefault: {
            badge: string;
            badgeDescription: string;
            default: {
                id: string;
                props: {
                    text: string;
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
