import { css } from "@microsoft/fast-element";
import { FASTBaseListItem } from "../base-list-item.js";
import { baseListItemTemplate } from "../base-list-item.template.js";

const styles = css`
    :host {
        display: block;
        contain: layout;
        box-sizing: border-box;
        height: auto;
        width: auto;
        background: var(--fill-color);
    }
`;

FASTBaseListItem.define({
    name: "fast-base-list-item",
    template: baseListItemTemplate(),
    styles,
});
