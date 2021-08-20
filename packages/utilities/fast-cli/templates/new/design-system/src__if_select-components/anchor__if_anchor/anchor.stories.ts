export default {
    title: "Components/Anchor",
    argTypes: {
        appearance: {
            options: [
                "neutral",
                "accent",
                "hypertext",
                "lightweight",
                "outline",
                "stealth",
            ],
            control: { type: "radio" },
        },
    },
};

const AnchorTemplate = ({ appearance, label }) => `
  </* @echo namespace */-anchor 
    ${appearance ? `appearance="${appearance}"` : ""}
  >
    ${label}
  <//* @echo namespace */-anchor>
`;

export const Anchor = AnchorTemplate.bind({});

const example = `
</* @echo namespace */-anchor href="#">Anchor<//* @echo namespace */-anchor>
`;

Anchor.args = {
    label: "Anchor",
    appearance: "neutral",
};

Anchor.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
