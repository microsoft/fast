import { /* @echo namespace */ ProgressRing } from "./index";

export default {
    title: "Components/Progress Ring",
    component: /* @echo namespace */ ProgressRing,
    argTypes: {
        paused: {
            control: { type: "boolean" },
        },
    },
};

const ProgressRingTemplate = ({ paused }) => `
  </* @echo namespace */-progress-ring 
    ${paused ? `paused="${paused}"` : ""}
  ><//* @echo namespace */-progress-ring>
`;

export const ProgressRing = ProgressRingTemplate.bind({});

ProgressRing.args = {
    paused: false,
};

const example = `
</* @echo namespace */-progress-ring min="0" max="100" value="75"><//* @echo namespace */-progress-ring>
`;
ProgressRing.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
