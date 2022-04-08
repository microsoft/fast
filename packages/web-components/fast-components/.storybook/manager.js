import { addons } from "@storybook/addons";
import theme from "./theme.js";

addons.setConfig({
    enableShortcuts: false,
    theme,
    backgrounds: { disable: true },
});
