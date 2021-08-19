export default {
    title: "Components/Tree View",
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
        renderCollapsedNodes: {
            control: { type: "boolean" },
        },
    },
};

const TreeViewTemplate = ({ disabled, renderCollapsedNodes }) => `
</* @echo namespace */-tree-view
  ${disabled ? "disabled" : ""}
  ${renderCollapsedNodes ? `render-collapsed-nodes="${renderCollapsedNodes}` : ""}
">
  </* @echo namespace */-tree-item>
    Root item 1
    </* @echo namespace */-tree-item>
      Flowers
      </* @echo namespace */-tree-item disabled>Daisy<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Sunflower<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Rose<//* @echo namespace */-tree-item>
    <//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 2<//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 3<//* @echo namespace */-tree-item>
  <//* @echo namespace */-tree-item>
  </* @echo namespace */-tree-item>
    Root item 2
    </* @echo namespace */-divider><//* @echo namespace */-divider>
    </* @echo namespace */-tree-item>
      Flowers
      </* @echo namespace */-tree-item disabled>Daisy<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Sunflower<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Rose<//* @echo namespace */-tree-item>
    <//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 2<//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 3<//* @echo namespace */-tree-item>
  <//* @echo namespace */-tree-item>
  </* @echo namespace */-tree-item> Root item 3 - Leaf Erikson <//* @echo namespace */-tree-item>
<//* @echo namespace */-tree-view>
`;

export const TreeView = TreeViewTemplate.bind({});

TreeView.args = {
    disabled: false,
    renderCollapsedNodes: false,
};

const example = `
</* @echo namespace */-tree-view>
  </* @echo namespace */-tree-item>
    Root item 1
    </* @echo namespace */-tree-item>
      Flowers
      </* @echo namespace */-tree-item disabled>Daisy<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Sunflower<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Rose<//* @echo namespace */-tree-item>
    <//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 2<//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 3<//* @echo namespace */-tree-item>
  <//* @echo namespace */-tree-item>
  </* @echo namespace */-tree-item>
    Root item 2
    </* @echo namespace */-divider><//* @echo namespace */-divider>
    </* @echo namespace */-tree-item>
      Flowers
      </* @echo namespace */-tree-item disabled>Daisy<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Sunflower<//* @echo namespace */-tree-item>
      </* @echo namespace */-tree-item>Rose<//* @echo namespace */-tree-item>
    <//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 2<//* @echo namespace */-tree-item>
    </* @echo namespace */-tree-item>Nested item 3<//* @echo namespace */-tree-item>
  <//* @echo namespace */-tree-item>
  </* @echo namespace */-tree-item> Root item 3 - Leaf Erikson <//* @echo namespace */-tree-item>
<//* @echo namespace */-tree-view>
`;

TreeView.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
