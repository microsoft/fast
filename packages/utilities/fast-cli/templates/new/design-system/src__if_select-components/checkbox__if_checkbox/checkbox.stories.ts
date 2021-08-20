export default {
    title: "Components/Checkbox",
    argTypes: {
        checked: {
            control: { type: "boolean" },
        },
        disabled: {
            control: { type: "boolean" },
        },
        required: {
            control: { type: "boolean" },
        },
    },
    parameters: {
        actions: {
            handles: ["mouseover", "click"],
        },
    },
};

const CheckboxTemplate = ({ checked, disabled, label, required }) =>
    `</* @echo namespace */-checkbox
    ${checked ? "checked" : ""}
    ${disabled ? "disabled" : ""}
    ${required ? "required" : ""}
    >${label}<//* @echo namespace */-checkbox>`;

export const Checkbox = CheckboxTemplate.bind({});

Checkbox.args = {
    label: "Label",
    checked: false,
    disabled: false,
    required: false,
};

const example = `
</* @echo namespace */-checkbox>Checkbox<//* @echo namespace */-checkbox>
`;

Checkbox.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
