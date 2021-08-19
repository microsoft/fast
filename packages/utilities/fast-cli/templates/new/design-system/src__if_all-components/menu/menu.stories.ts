export default {
    title: "Components/Menu",
};

const MenuTemplate = () => `
  </* @echo namespace */-menu>
    </* @echo namespace */-menu-item>Menu item 1<//* @echo namespace */-menu-item>
    </* @echo namespace */-menu-item>Menu item 2<//* @echo namespace */-menu-item>
    </* @echo namespace */-menu-item disabled="true">Menu item 3<//* @echo namespace */-menu-item>
    </* @echo namespace */-menu-item>
      Menu item 4
      <div slot="end">Shortcut text</div>
    <//* @echo namespace */-menu-item>
  <//* @echo namespace */-menu>
`;

export const Menu = MenuTemplate.bind({});

const example = `
</* @echo namespace */-menu>
  </* @echo namespace */-menu-item>Menu item 1<//* @echo namespace */-menu-item>
  </* @echo namespace */-menu-item>Menu item 2<//* @echo namespace */-menu-item>
  </* @echo namespace */-menu-item disabled="true">Menu item 3<//* @echo namespace */-menu-item>
  </* @echo namespace */-menu-item>
    Menu item 4
    <div slot="end">Shortcut text</div>
  <//* @echo namespace */-menu-item>
<//* @echo namespace */-menu>
`;

Menu.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
