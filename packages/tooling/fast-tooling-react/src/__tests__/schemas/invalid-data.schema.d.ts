declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        invalidBooleanWrongType: {
            title: string;
            type: string;
        };
        invalidBooleanRequired: {
            title: string;
            type: string;
        };
        invalidNullWrongType: {
            title: string;
            type: string;
        };
        invalidNullRequired: {
            title: string;
            type: string;
        };
        invalidStringWrongType: {
            title: string;
            type: string;
        };
        invalidNumberWrongType: {
            title: string;
            type: string;
        };
        invalidEnumWrongType: {
            title: string;
            type: string;
            enum: string[];
        };
        invalidArrayWrongType: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
            };
        };
        invalidObjectWrongType: {
            title: string;
            type: string;
        };
        invalidObjectMissingProperty: {
            title: string;
            type: string;
            properties: {
                foo: {
                    title: string;
                    type: string;
                };
                bar: {
                    title: string;
                    type: string;
                };
            };
            required: string[];
        };
        objectExample: {
            title: string;
            type: string;
            properties: {
                invalidBooleanWrongType: {
                    title: string;
                    type: string;
                };
            };
        };
        arrayExample: {
            title: string;
            type: string;
            items: {
                title: string;
                type: string;
            };
        };
    };
    required: string[];
};
export default _default;
