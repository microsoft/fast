import { /* @echo namespace */ Progress } from "./index";

export default {
    title: "Components/Progress",
    component: /* @echo namespace */ Progress,
    argTypes: {
        paused: {
            control: { type: "boolean" },
        },
    },
};

const ProgressTemplate = ({ paused, value }) => `
  </* @echo namespace */-progress
    ${paused ? `paused="${paused}"` : ""}
    ${value ? `value=${value}` : ""}
  ><//* @echo namespace */-progress>
`;

export const Progress = ProgressTemplate.bind({});

Progress.args = {
    value: 50,
    paused: false,
};

const example = `
</* @echo namespace */-progress min="0" max="100" value="75"><//* @echo namespace */-progress>
`;

Progress.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
