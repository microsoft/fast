import { /* @echo namespace */ Listbox } from "./index";

export default {
    title: "Components/Listbox",
    component: /* @echo namespace */ Listbox,
};

const listBoxTemplate = () => `
  </* @echo namespace */-listbox>
    </* @echo namespace */-option>This option has no value<//* @echo namespace */-option>
    </* @echo namespace */-option disabled>This option is disabled<//* @echo namespace */-option>
    </* @echo namespace */-option value="hi">This option has a value<//* @echo namespace */-option>
    </* @echo namespace */-option selected>This option is selected by default<//* @echo namespace */-option>
  <//* @echo namespace */-listbox>
`;

export const Listbox = listBoxTemplate.bind({});

const example = `
</* @echo namespace */-listbox>
  </* @echo namespace */-option>This option has no value<//* @echo namespace */-option>
  </* @echo namespace */-option disabled>This option is disabled<//* @echo namespace */-option>
  </* @echo namespace */-option value="hi">This option has a value<//* @echo namespace */-option>
  </* @echo namespace */-option selected>This option is selected by default<//* @echo namespace */-option>
<//* @echo namespace */-listbox>
`;

Listbox.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
