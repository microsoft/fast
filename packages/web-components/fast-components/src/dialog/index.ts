import { customElement } from "@microsoft/fast-element";
import { Dialog, DialogTemplate as template } from "@microsoft/fast-foundation";
import { DialogStyles as styles } from "./dialog.styles.js";

@customElement({
    name: "fast-dialog",
    template,
    styles,
})
export class FASTDialog extends Dialog {}
