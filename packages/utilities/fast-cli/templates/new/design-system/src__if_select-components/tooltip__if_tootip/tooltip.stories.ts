export default {
    title: "Components/Tooltip",
    argTypes: {
        position: {
            options: ["top", "right", "bottom", "left"],
            control: { type: "radio" },
        },
    },
};

const TooltipTemplate = ({ label, position }) => `
  </* @echo namespace */-tooltip 
    anchor="button" 
    ${position ? `position="${position}"` : ""}
  >
    ${label}
  <//* @echo namespace */-tooltip>
  </* @echo namespace */-button id="button">Reveal Tooltip<//* @echo namespace */-button>
`;

export const Tooltip = TooltipTemplate.bind({});

Tooltip.args = {
    label: `I'm helping!`,
};

const example = `
</* @echo namespace */-tooltip anchor="anchor-default"> Helpful text is helpful <//* @echo namespace */-tooltip>
`;

Tooltip.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
