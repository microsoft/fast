import { /* @echo namespace */ MenuItem } from "./index";

export default {
    title: "Components/Menu Item",
    component: /* @echo namespace */ MenuItem,
    argTypes: {
        checked: {
            control: { type: "boolean" },
        },
        disabled: {
            control: { type: "boolean" },
        },
    },
};

const MenuItemTemplate = ({ checked, disabled }) => `
  </* @echo namespace */-menu-item
    ${checked ? `checked="${checked}"` : ""}
    ${disabled ? "disabled" : ""}
  >Menu item 1<//* @echo namespace */-menu-item>
`;

export const MenuItem = MenuItemTemplate.bind({});

MenuItem.args = {
    disabled: false,
    checked: false,
};

const example = `
</* @echo namespace */-menu-item>Menu item<//* @echo namespace */-menu-item>
`;

MenuItem.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
