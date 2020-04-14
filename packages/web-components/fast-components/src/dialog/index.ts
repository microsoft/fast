import { customElement } from "@microsoft/fast-element";
import { Dialog } from "./dialog";
import { DialogTemplate as template } from "./dialog.template";
import { DialogStyles as styles } from "./dialog.styles";

@customElement({
    name: "fast-dialog",
    template,
    styles,
})
export class FASTDialog extends Dialog {}
export * from "./dialog.template";
export * from "./dialog.styles";
export * from "./dialog";
