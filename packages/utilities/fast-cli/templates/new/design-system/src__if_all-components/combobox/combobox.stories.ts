export default {
    title: "Components/Combobox",
    argTypes: {
        appearance: {
            options: ["filled", "outline"],
            control: { type: "radio" },
        },
        autocomplete: {
            options: ["inline", "list", "none", "both"],
            control: { type: "radio" },
        },
        position: {
            options: ["above", "below"],
            control: { type: "radio" },
        },
        required: {
            control: { type: "boolean" },
        },
    },
};

const ComboboxTemplate = ({ appearance, autocomplete, position, required }) => `
  </* @echo namespace */-combobox
    ${appearance ? `appearance="${appearance}"` : ""}
    ${appearance ? `autocomplete="${autocomplete}"` : ""}
    ${required ? "required" : ""}
    ${position ? `position="${position}"` : ""}
  >
    </* @echo namespace */-option>Please Please Me<//* @echo namespace */-option>
    </* @echo namespace */-option>With The Beatles<//* @echo namespace */-option>
    </* @echo namespace */-option>A Hard Day's Night<//* @echo namespace */-option>
    </* @echo namespace */-option>Beatles for Sale<//* @echo namespace */-option>
    </* @echo namespace */-option>Help!<//* @echo namespace */-option>
    </* @echo namespace */-option>Rubber Soul<//* @echo namespace */-option>
    </* @echo namespace */-option>Revolver<//* @echo namespace */-option>
    </* @echo namespace */-option>Sgt. Pepper's Lonely Hearts Club Band<//* @echo namespace */-option>
    </* @echo namespace */-option>Magical Mystery Tour<//* @echo namespace */-option>
    </* @echo namespace */-option>The Beatles<//* @echo namespace */-option>
    </* @echo namespace */-option>Yellow Submarine<//* @echo namespace */-option>
    </* @echo namespace */-option>Abbey Road<//* @echo namespace */-option>
    </* @echo namespace */-option>Let It Be<//* @echo namespace */-option>
  </* @echo namespace */-combobox/>
`;

export const Combobox = ComboboxTemplate.bind({});

Combobox.args = {
    value: "Christopher Eccleston",
    appearance: "outline",
};

const example = `
</* @echo namespace */-combobox>
  </* @echo namespace */-option>Please Please Me<//* @echo namespace */-option>
  </* @echo namespace */-option>With The Beatles<//* @echo namespace */-option>
  </* @echo namespace */-option>A Hard Day's Night<//* @echo namespace */-option>
  </* @echo namespace */-option>Beatles for Sale<//* @echo namespace */-option>
  </* @echo namespace */-option>Help!<//* @echo namespace */-option>
  </* @echo namespace */-option>Rubber Soul<//* @echo namespace */-option>
  </* @echo namespace */-option>Revolver<//* @echo namespace */-option>
  </* @echo namespace */-option>Sgt. Pepper's Lonely Hearts Club Band<//* @echo namespace */-option>
  </* @echo namespace */-option>Magical Mystery Tour<//* @echo namespace */-option>
  </* @echo namespace */-option>The Beatles<//* @echo namespace */-option>
  </* @echo namespace */-option>Yellow Submarine<//* @echo namespace */-option>
  </* @echo namespace */-option>Abbey Road<//* @echo namespace */-option>
  </* @echo namespace */-option>Let It Be<//* @echo namespace */-option>
<//* @echo namespace */-combobox>
`;
Combobox.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
