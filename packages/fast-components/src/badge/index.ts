import { customElement } from "@microsoft/fast-element";
import { Badge } from "./badge";
import { BadgeTemplate as template } from "./badge.template";
import { BadgeStyles as styles } from "./badge.styles";

@customElement({
    name: "fast-badge",
    template,
    styles,
})
export class FASTBadge extends Badge {}
export * from "./badge.template";
export * from "./badge.styles";
export * from "./badge";
