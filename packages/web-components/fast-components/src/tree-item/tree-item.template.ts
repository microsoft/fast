import { html, ref, when } from "@microsoft/fast-element";
import { bool } from "../utilities";
import { TreeItem } from "./tree-item";

export const TreeItemTemplate = html<TreeItem>`
<template
    role="treeitem"
    $aria-expanded="${x => (x.hasItems ? bool(x.expanded) : void 0)}"
    $aria-selected="${x => bool(x.selected)}"
    tabindex="${x => (x.focusable ? 0 : -1) /* need to manage focus here */}"
    @focus=${(x, c) => x.handleFocus}
    @blur=${(x, c) => x.handleBlur}
    @keydown=${(x, c) => x.handleKeyDown}
    ${ref("treeItem")}
>
    <div
        class="positioning-region"
        part="positioning-region"
        @click="${(x, c) => x.handleContainerClick}"
    >
        <div
            class="content-region"
            part="content-region"
        >
            ${when(
                x => !!x.hasItems,
                html<TreeItem>`
                <div
                    aria-hidden="true"
                    class="expand-collapse-button"
                    part="expand-collapse-button"
                    @click="${x => x.handleExpandCollapseButtonClick}"
                    ${ref("expandCollapseButton")}
                >
                    <slot name="expand-collapse-glyph">
                        <svg
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                            class="expand-collapse-glyph"
                        >
                            <path d="M4.29 12L12 4.29V12H4.29z" />
                        </svg>
                    </slot>
                </div>
                `
            )}
            <span
                part="before-content"
                ${ref("beforeContentContainer")}
            >
                <slot
                    name="before-content"
                    ${ref("beforeContent")}
                    @slotchange=${x => x.handleBeforeContentChange()}
                ></slot>
            </span>
            <slot></slot>
            <span
                part="after-content"
                ${ref("afterContentContainer")}
            >
                <slot
                    name="after-content"
                    ${ref("afterContent")}
                    @slotchange=${x => x.handleAfterContentChange()}
                ></slot>
            </span>
        </div>
    </div>
    ${when(
        x => !!x.hasItems,
        html<TreeItem>`
            <div
                role="group"
                class="items"
                part="items"
            >
                <slot
                    name="item"
                    ${ref("items")}
                    @slotchange=${x => x.handleItemsChange()}
                ></slot>
            <div>
        `
    )}
</template>
`;
