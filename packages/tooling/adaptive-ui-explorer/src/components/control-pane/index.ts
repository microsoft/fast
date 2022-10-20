import { ControlPane } from "./control-pane.js";
import { controlPaneStyles as styles } from "./control-pane.styles.js";
import { controlPaneTemplate as template } from "./control-pane.template.js";

ControlPane.define({
    name: "app-control-pane",
    styles,
    template: template(),
});

export { ControlPane } from "./control-pane.js";
