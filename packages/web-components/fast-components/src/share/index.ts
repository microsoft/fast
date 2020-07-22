import { customElement } from "@microsoft/fast-element";
import { Share, ShareTemplate as template } from "@microsoft/fast-foundation";
import { ShareStyles as styles } from "./share.styles";

@customElement({
    name: "fast-share",
    template,
    styles,
})
export class FASTShare extends Share {}
export * from "./share-group";
export * from "./share-link";
