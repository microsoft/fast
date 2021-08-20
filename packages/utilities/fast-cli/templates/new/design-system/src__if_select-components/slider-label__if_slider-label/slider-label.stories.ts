export default {
    title: "Components/Slider Label",
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
        hideMark: {
            control: { type: "boolean" },
        },
        position: {
            control: { type: "number" },
        },
    },
};

const SliderLabelTemplate = ({ disabled, hideMark, label, orientation, position }) => `
  </* @echo namespace */-slider-label
    ${disabled ? "disabled" : ""}
    ${hideMark ? `hide-mark="${hideMark}"` : ""}
    ${position ? `position="${position}"` : ""}
  >
    ${label}
  <//* @echo namespace */-slider-label>
`;

export const SliderLabel = SliderLabelTemplate.bind({});

SliderLabel.args = {
    hideMark: false,
    label: "Label",
};

const example = `
</* @echo namespace */-slider-label> basic <//* @echo namespace */-slider-label>
`;

SliderLabel.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
