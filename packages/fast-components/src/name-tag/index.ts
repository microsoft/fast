import { customElement } from "@microsoft/fast-element";
import { NameTag } from "./name-tag";
import { NameTagTemplate } from "./name-tag.template";
import { NameTagStyles } from "./name-tag.styles";

@customElement({
    name: "fast-name-tag",
    template: NameTagTemplate,
    dependencies: [NameTagStyles],
})
export class FASTNameTag extends NameTag {}
export * from "./name-tag.template";
export * from "./name-tag.styles";
export * from "./name-tag";
