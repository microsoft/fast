export default {
    title: "Components/Select",
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
        position: {
            options: ["above", "below"],
            control: { type: "radio" },
        },
    },
};

const SelectTemplate = ({ disabled, position }) => `
  </* @echo namespace */-select 
    ${disabled ? "disabled" : ""} 
    ${position ? `position="${position}"` : ""}
  >
    </* @echo namespace */-option>Option One<//* @echo namespace */-option>
    </* @echo namespace */-option>Option Two<//* @echo namespace */-option>
    </* @echo namespace */-option>Option Three<//* @echo namespace */-option>
    </* @echo namespace */-option>Option Four<//* @echo namespace */-option>
  <//* @echo namespace */-select>
`;

export const Select = SelectTemplate.bind({});
Select.args = {
    disabled: false,
};

const example = `
</* @echo namespace */-select>
  </* @echo namespace */-option>This option has no value<//* @echo namespace */-option>
  </* @echo namespace */-option disabled>This option is disabled<//* @echo namespace */-option>
  </* @echo namespace */-option value="hi">This option has a value<//* @echo namespace */-option>
  </* @echo namespace */-option selected>This option is selected by default<//* @echo namespace */-option>
<//* @echo namespace */-select>
`;

Select.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
