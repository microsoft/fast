export default {
    title: "Components/Listbox Option",
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
        selected: {
            control: { type: "boolean" },
        },
        value: {
            control: { type: "text" },
        },
    },
};

const listBoxTemplate = ({ disabled, label, selected, value }) => `
  </* @echo namespace */-option 
    ${disabled ? "disabled" : ""}
    ${selected ? "selected" : ""}
    ${value ? `value="${value}"` : ""}
  >${label}<//* @echo namespace */-option>
`;

export const ListboxOption = listBoxTemplate.bind({});

ListboxOption.args = {
    label: "This is an Option",
    selected: false,
};

const example = `
</* @echo namespace */-option> Text content is the value when the value attribute is absent. <//* @echo namespace */-option>
`;

ListboxOption.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
