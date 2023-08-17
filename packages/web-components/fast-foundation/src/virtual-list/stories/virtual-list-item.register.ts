import { css } from "@microsoft/fast-element";
import { FASTVirtualListItem } from "../virtual-list-item.js";
import { virtualListItemTemplate } from "../virtual-list-item.template.js";

const styles = css`
    :host {
        position: absolute;
        display: block;
        contain: layout;
        box-sizing: border-box;
        height: auto;
        width: auto;
        background: var(--fill-color);
    }
`;

FASTVirtualListItem.define({
    name: "fast-virtual-list-item",
    template: virtualListItemTemplate(),
    styles,
});
