import { customElement } from "@microsoft/fast-element";
import { NameTag } from "./name-tag";
import { NameTagTemplate as template } from "./name-tag.template";
import { NameTagStyles as styles } from "./name-tag.styles";

@customElement({
    name: "fast-name-tag",
    template,
    styles,
})
export class FASTNameTag extends NameTag {}
export * from "./name-tag.template";
export * from "./name-tag.styles";
export * from "./name-tag";
