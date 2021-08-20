export default {
    title: "Components/Badge",
    argTypes: {
        appearance: {
            options: ["neutral", "accent", "lightweight"],
            control: { type: "radio" },
        },
    },
};

const BadgeTemplate = ({ appearance, label }) => `
  </* @echo namespace */-badge 
    ${appearance ? `appearance="${appearance}"` : ""}
  >${label}<//* @echo namespace */-badge>`;

export const Badge = BadgeTemplate.bind({});

Badge.args = {
    label: "Badge",
    appearance: "accent",
};

Badge.parameters = {
    docs: {
        source: {
            code: `</* @echo namespace */-badge appearance="neutral">Text<//* @echo namespace */-badge>`,
        },
    },
};
