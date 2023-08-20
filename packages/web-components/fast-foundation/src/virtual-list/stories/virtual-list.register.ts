import { css } from "@microsoft/fast-element";
import { FASTVirtualList } from "../virtual-list.js";
import { virtualListTemplate } from "../virtual-list.template.js";

import { registerImageGrid } from "./examples/image-grid.js";

const styles = css`
    :host {
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
    :host([orientation="horizontal"]) {
        width: 100%;
        overflow-y: hidden;
        overflow-x: scroll;
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

registerImageGrid();
