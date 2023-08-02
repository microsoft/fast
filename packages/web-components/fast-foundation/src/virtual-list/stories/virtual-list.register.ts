import { css } from "@microsoft/fast-element";
import { FASTVirtualList } from "../virtual-list.js";
import { virtualListTemplate } from "../virtual-list.template.js";

const styles = css`
    :host {
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
    .container {
        position: relative;
    }
`;

FASTVirtualList.define({
    name: "fast-virtual-list",
    styles,
    template: virtualListTemplate({
        virtualListItem: "fast-virtual-list-item",
    }),
});
