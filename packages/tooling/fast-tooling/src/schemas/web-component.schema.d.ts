declare const _default: {
    $schema: string;
    $id: string;
    title: string;
    type: string;
    version: number;
    required: string[];
    properties: {
        version: {
            title: string;
            type: string;
            enum: number[];
        };
        tags: {
            type: string;
            items: {
                type: string;
                properties: {
                    name: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    attributes: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                name: {
                                    type: string;
                                };
                                type: {
                                    type: string;
                                };
                                description: {
                                    type: string;
                                };
                                default: {
                                    type: string;
                                };
                                required: {
                                    type: string;
                                };
                            };
                        };
                    };
                    slots: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                name: {
                                    type: string;
                                };
                                description: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
/**
 * This is the data structure for a web component definition
 *
 * Important: if it is updated, also update the "../data-utilities/web-component.ts" file
 */
export default _default;
