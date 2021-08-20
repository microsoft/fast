export default {
    title: "Components/Flipper",
    argTypes: {
        direction: {
            options: ["previous", "next"],
            control: { type: "select" },
        },
        disabled: { type: "boolean" },
    },
};

const FlipperTemplate = ({ direction, disabled, content }) =>
    `</* @echo namespace */-flipper 
    ${disabled ? "disabled" : ""} 
    ${direction ? `direction="${direction}"` : ""}
  ><//* @echo namespace */-flipper>`;

export const Flipper = FlipperTemplate.bind({});

Flipper.args = {
    disabled: false,
    direction: "next",
};

const example = `
</* @echo namespace */-flipper direction="previous"><//* @echo namespace */-flipper>
`;

Flipper.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
