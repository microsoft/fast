export default {
    title: "Components/Accordion",
    argTypes: {
        expandMode: {
            options: ["single", "multi"],
            control: { type: "radio" },
            defaultValue: "multi",
        },
    },
};

const AccordionTemplate = ({ expandMode }) => `
  </* @echo namespace */-accordion
    ${expandMode ? `expand-mode="${expandMode}"` : ""}
  >
    </* @echo namespace */-accordion-item expanded>
      <div slot="start">
        <button>1</button>
      </div>
      <div slot="end">
        <button>1</button>
      </div>
      <span slot="heading">Panel one</span>
      Panel one content
    <//* @echo namespace */-accordion-item>
    </* @echo namespace */-accordion-item>
      <span slot="heading">Panel two</span>
      Panel two content
    <//* @echo namespace */-accordion-item>
    </* @echo namespace */-accordion-item expanded>
      <span slot="heading">Panel three</span>
      Panel three content
    <//* @echo namespace */-accordion-item>
  <//* @echo namespace */-accordion>
`;

export const Accordion = AccordionTemplate.bind({});

const example = `
</* @echo namespace */-accordion>
  </* @echo namespace */-accordion-item expanded>
    <div slot="start">
      <button>1</button>
    </div>
    <div slot="end">
      <button>1</button>
    </div>
    <span slot="heading">Panel one</span>
    Panel one content
  <//* @echo namespace */-accordion-item>
  </* @echo namespace */-accordion-item>
    <span slot="heading">Panel two</span>
    Panel two content
  <//* @echo namespace */-accordion-item>
  </* @echo namespace */-accordion-item expanded>
    <span slot="heading">Panel three</span>
    Panel three content
  <//* @echo namespace */-accordion-item>
<//* @echo namespace */-accordion>
`;

Accordion.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
