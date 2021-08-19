export default {
    title: "Components/Slider",
    argTypes: {
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "radio" },
        },
    },
};

const SliderTemplate = ({ orientation }) => `
  </* @echo namespace */-slider 
    ${orientation ? `orientation="${orientation}"` : ""}
    min="0" max="100" step="10"
  >
    </* @echo namespace */-slider-label position="0"> 0&#8451; <//* @echo namespace */-slider-label>
    </* @echo namespace */-slider-label position="10"> 10&#8451; <//* @echo namespace */-slider-label>
    </* @echo namespace */-slider-label position="90"> 90&#8451; <//* @echo namespace */-slider-label>
    </* @echo namespace */-slider-label position="100"> 100&#8451; <//* @echo namespace */-slider-label>
  <//* @echo namespace */-slider>`;

export const Slider = SliderTemplate.bind({});

Slider.args = {
    orientation: "horizontal",
};

const example = `
</* @echo namespace */-slider><//* @echo namespace */-slider>
`;

Slider.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
