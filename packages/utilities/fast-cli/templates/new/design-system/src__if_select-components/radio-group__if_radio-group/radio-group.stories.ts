export default {
    title: "Components/Radio Group",
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
        required: {
            control: { type: "boolean" },
        },
    },
};

const RadioGroupTemplate = ({ disabled, required }) => `
  </* @echo namespace */-radio-group
    ${disabled ? "disabled" : ""}
    ${required ? "required" : ""}
  >
    </* @echo namespace */-radio>Apples<//* @echo namespace */-radio>
    </* @echo namespace */-radio>Bananas<//* @echo namespace */-radio>
  <//* @echo namespace */-radio-group>`;

export const RadioGroup = RadioGroupTemplate.bind({});

RadioGroup.args = {
    disabled: false,
    required: false,
};

const example = `
</* @echo namespace */-radio-group name="numbers">
  <label style="color: --var(neutral-foreground-rest)" slot="label"> Numbers </label>
  </* @echo namespace */-radio value="one">One<//* @echo namespace */-radio>
  </* @echo namespace */-radio value="two">Two<//* @echo namespace */-radio>
<//* @echo namespace */-radio-group>
`;

RadioGroup.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
