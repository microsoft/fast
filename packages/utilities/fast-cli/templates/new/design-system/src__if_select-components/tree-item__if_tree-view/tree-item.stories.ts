export default {
    title: "Components/Tree Item",
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
        selected: {
            control: { type: "boolean" },
        },
    },
};

const TreeItemTemplate = ({ disabled, label, selected }) => `
  </* @echo namespace */-tree-item
    ${disabled ? "disabled" : ""}
    ${selected ? "selected" : ""}
  >${label}<//* @echo namespace */-tree-item>`;

export const TreeItem = TreeItemTemplate.bind({});

TreeItem.args = {
    label: "Tree Item",
    disabled: false,
    selected: false,
};

const example = `
</* @echo namespace */-tree-item>Tree item<//* @echo namespace */-tree-item>
`;

TreeItem.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
