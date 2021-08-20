export default {
    title: "Components/Radio",
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
};

const RadioTemplate = ({ checked, disabled, required }) => `
  </* @echo namespace */-radio
    ${checked ? "checked" : ""}
    ${disabled ? "disabled" : ""}
    ${required ? "required" : ""}
  ><//* @echo namespace */-radio>
`;

export const Radio = RadioTemplate.bind({});

Radio.args = {
    checked: false,
    disabled: false,
    required: false,
};

const example = `
</* @echo namespace */-radio><//* @echo namespace */-radio>
`;

Radio.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
