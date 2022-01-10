import { addons } from "@storybook/addons";
import theme from "./theme";

addons.setConfig({
    enableShortcuts: false,
    sidebar: {
        showRoots: true,
    },
    theme,
});
