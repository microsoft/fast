export default {
    title: "Components/Tabs",
    argTypes: {
        activeIndicator: {
            control: { type: "boolean" },
        },
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "radio" },
        },
    },
};

const TabsTemplate = ({ activeId, activeIndicator, orientation }) => `
</* @echo namespace */-tabs
  ${orientation ? `orientation="${orientation}"` : ""}
  ${activeIndicator ? `activeIndicator="${activeIndicator}"` : ""}
  ${activeId ? `activeId="${activeId}"` : ""}
>
  </* @echo namespace */-tab id="TabOne">Tab one<//* @echo namespace */-tab>
  </* @echo namespace */-tab id="TabTwo">Tab two<//* @echo namespace */-tab>
  </* @echo namespace */-tab id="TabThree">Tab three<//* @echo namespace */-tab>
  </* @echo namespace */-tab-panel> Tab one content. This is for testing. <//* @echo namespace */-tab-panel>
  </* @echo namespace */-tab-panel> Tab two content. This is for testing. <//* @echo namespace */-tab-panel>
  </* @echo namespace */-tab-panel> Tab three content. This is for testing. <//* @echo namespace */-tab-panel>
<//* @echo namespace */-tabs>`;

export const Tabs = TabsTemplate.bind({});

Tabs.args = {
    activeId: "TabTwo",
    activeIndicator: true,
    orientation: "vertical",
};

const example = `
</* @echo namespace */-tabs id="myTab" activeId="TabTwo">
  </* @echo namespace */-tab id="TabOne">Tab one<//* @echo namespace */-tab>
  </* @echo namespace */-tab id="TabTwo">Tab two<//* @echo namespace */-tab>
  </* @echo namespace */-tab id="TabThree">Tab three<//* @echo namespace */-tab>
  </* @echo namespace */-tab-panel id="TabPanelOne"> Tab one content. This is for testing. <//* @echo namespace */-tab-panel>
  </* @echo namespace */-tab-panel id="TabPanelTwo"> Tab two content. This is for testing. <//* @echo namespace */-tab-panel>
  </* @echo namespace */-tab-panel id="TabPanelThree"> Tab three content. This is for testing. <//* @echo namespace */-tab-panel>
  <div>Testing</div>
<//* @echo namespace */-tabs>
`;

Tabs.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
