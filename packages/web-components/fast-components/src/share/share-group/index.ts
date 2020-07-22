import { customElement } from "@microsoft/fast-element";
import { ShareGroup, ShareGroupTemplate as template } from "@microsoft/fast-foundation";
import { ShareGroupStyles as styles } from "./share-group.styles";

@customElement({
    name: "fast-share-group",
    template,
    styles,
})
export class FASTShareGroup extends ShareGroup {}
