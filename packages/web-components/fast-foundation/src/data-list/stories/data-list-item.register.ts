import { css } from "@microsoft/fast-element";
import { FASTDataListItem } from "../data-list-item.js";
import { dataListItemTemplate } from "../data-list-item.template.js";

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

FASTDataListItem.define({
    name: "fast-data-list-item",
    template: dataListItemTemplate(),
    styles,
});
