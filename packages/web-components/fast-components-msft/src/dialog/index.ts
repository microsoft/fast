import { customElement } from "@microsoft/fast-element";
import { Dialog, DialogTemplate as template } from "@microsoft/fast-components";
import { DialogStyles as styles } from "./dialog.styles.js";

@customElement({
    name: "msft-dialog",
    template,
    styles,
})
export class MSFTDialog extends Dialog {}
