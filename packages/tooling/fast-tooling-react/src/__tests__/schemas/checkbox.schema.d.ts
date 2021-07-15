declare const _default: {
    $schema: string;
    title: string;
    description: string;
    type: string;
    id: string;
    properties: {
        toggle: {
            title: string;
            type: string;
        };
        optionalToggle: {
            title: string;
            type: string;
        };
        defaultToggle: {
            title: string;
            type: string;
            default: boolean;
        };
        disabledToggle: {
            title: string;
            type: string;
            disabled: boolean;
        };
    };
    required: string[];
};
export default _default;
