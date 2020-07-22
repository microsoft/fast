import { customElement } from "@microsoft/fast-element";
import { ShareLink, ShareLinkTemplate as template } from "@microsoft/fast-foundation";
import { ShareLinkStyles as styles } from "./share-link.styles";

@customElement({
    name: "fast-share-link",
    template,
    styles,
})
export class FASTShareLink extends ShareLink {}
