export default {
    title: "Components/Text Field",
    argTypes: {
        appearance: {
            defaultValue: "outlined",
            options: ["filled", "outlined"],
            control: { type: "radio" },
        },
        autoFocus: {
            description: "Automatically focuses the control",
            control: { type: "boolean" },
        },
        disabled: {
            description:
                "The text field should be submitted with the form but should not be editable",
            control: { type: "boolean" },
        },
        list: {
            control: { type: "text" },
        },
        maxlength: {
            control: { type: "number" },
        },
        name: {
            control: { type: "text" },
        },
        minlength: {
            control: { type: "number" },
        },
        pattern: {
            description: `A regular expression the input's contents must match in order to be valid`,
            control: { type: "text" },
        },
        placeholder: {
            description:
                "An exemplar value to display in the input field whenever it is empty",
            defaultValue: "Placeholder",
            control: { type: "text" },
        },
        readonly: {
            control: { type: "boolean" },
        },
        required: {
            control: { type: "boolean" },
        },
        spellcheck: {
            control: { type: "boolean" },
        },
        type: {
            options: ["text", "email", "password", "tel", "url"],
            control: { type: "radio" },
        },
    },
};

const TextFieldTemplate = ({
    appearance,
    autoFocus,
    disabled,
    list,
    maxlength,
    name,
    minlength,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    spellcheck,
    type,
}) =>
    `</* @echo namespace */-text-field
    ${appearance ? `appearance="${appearance}"` : ""}
    ${autoFocus ? "autofocus" : ""}
    ${disabled ? "disabled" : ""}
    ${list ? `list="${list}"` : ""}
    ${maxlength ? `maxlength="${maxlength}"` : ""}
    ${name ? `name="${name}"` : ""}
    ${minlength ? `minlength="${minlength}"` : ""}
    ${pattern ? `pattern="${pattern}"` : ""}
    ${placeholder ? `placeholder="${placeholder}"` : ""}
    ${readonly ? "readonly" : ""}
    ${required ? "required" : ""}
    ${spellcheck ? `spellcheck="${spellcheck}"` : ""}
    ${size ? `size="${size}"` : ""}
    ${type ? `type="${type}"` : ""}
  ><//* @echo namespace */-text-field>`;

export const TextField = TextFieldTemplate.bind({});

TextField.args = {
    placeholder: "",
    autoFocus: false,
    disabled: false,
    readonly: false,
    required: false,
};

const example = `
</* @echo namespace */-text-field><//* @echo namespace */-text-field>
`;

TextField.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
