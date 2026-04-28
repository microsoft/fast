import { css } from "@microsoft/fast-element";
import { FASTTreeView } from "../tree-view.js";
import { treeViewTemplate } from "../tree-view.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }
    :host {
        flex-direction: column;
        align-items: stretch;
        display: flex;
        min-width: fit-content;
        font-size: 0;
    }

    :host:focus-visible {
        outline: none;
    }
`;

FASTTreeView.define({
    name: "fast-tree-view",
    styles,
    template: treeViewTemplate(),
});
