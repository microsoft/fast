import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { TreeView } from "../tree-view.js";
import { treeViewTemplate as template } from "../tree-view.template.js";

const styles = () => css`
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

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        TreeView.compose({
            baseName: "tree-view",
            styles,
            template,
        })()
    );
