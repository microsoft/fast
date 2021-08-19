export default {
    title: "Components/Button",
    argTypes: {
        appearance: {
            description: "This controls the basic appearances",
            control: { type: "select" },
            options: ["neutral", "accent", "lighweight", "outline", "stealth"],
            default: "neutral",
        },
        disabled: {
            control: { type: "boolean" },
        },
    },
};

const ButtonTemplate = ({ appearance, disabled, label }) =>
    `
    </* @echo namespace */-button
      ${disabled ? "disabled" : ""}
      ${appearance ? `appearance="${appearance}"` : ""}
    >
      ${label}
    <//* @echo namespace */-button>
  `;

export const Button = ButtonTemplate.bind({});

Button.args = {
    label: "Button",
    disabled: false,
    appearance: "neutral",
};

const example = `
</* @echo namespace */-button>Button<//* @echo namespace */-button>
`;

Button.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
