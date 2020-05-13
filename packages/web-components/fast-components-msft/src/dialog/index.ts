import { customElement } from "@microsoft/fast-element";
import { Dialog, DialogTemplate as template } from "@microsoft/fast-components";
import { DialogStyles as styles } from "./dialog.styles";

@customElement({
    name: "fast-dialog",
    template,
    styles,
})
export class FASTDialog extends Dialog {}
