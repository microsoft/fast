export default {
    title: "Components/Switch",
    argTypes: {
        checked: {
            control: { type: "boolean" },
        },
        disabled: {
            control: { type: "boolean" },
        },
    },
};

const SwitchTemplate = ({ checked, disabled }) => `
</* @echo namespace */-switch
  ${checked ? "checked" : ""}
  ${disabled ? "disabled" : ""}
><//* @echo namespace */-switch>
`;

export const Switch = SwitchTemplate.bind({});

Switch.args = {
    checked: false,
    disabled: false,
};

const example = `
</* @echo namespace */-switch><//* @echo namespace */-switch>
`;

Switch.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
