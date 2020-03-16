import { html, ref, when } from "@microsoft/fast-element";
import { TreeItem } from "./tree-item";

export const TreeItemTemplate = html<TreeItem>`
<template
    role="treeitem"
    ?aria-expanded="${x => x.expanded}"
    ?aria-selected="${x => x.selected}"
    tabIndex="${this.focusable ? 0 : -1 /* need to manage focus here focusable?? */}"
    onFocus="${this.handleFocus}"
    onBlur="${this.handleBlur}"
    onKeyDown="${this.handleKeyDown}"
    ${ref("treeItem")}
>
    <div
        class="positioning-region"
        part="positioning-region"
        @click="${this.handleContainerClick}"
    >
        <div
            class="content-region"
            part="content-region"
        >
            <div
                aria-hidden="true"
                class="expand-collapse-button"
                part="expand-collapse-button"
                @click="${this.handleExpandCollapseButtonClick}"
                ${ref("expandCollapseButton")}
            >
                <slot name="expand-collapse-glyph"></slot>
            </div>
            <span
                class="before-content"
                part="before-content"
                ${ref("beforeContentContainer")}
            >
                <slot
                    name="before-content"
                    ${ref("beforeContent")}
                ></slot>
            </span>
            <slot></slot>
            <span
                class="after-content"
                part="after-content"
                ${ref("afterContentContainer")}
            >
                <slot
                    name="after-content"
                    ${ref("afterContent")}
                ></slot>
            </span>
        </div>
    </div>
    ${when(
        // we need to pass selected and expanded handling?
        x => x.childNodes.length,
        html`
            <div
                role="group"
            >
                <slot name="item"></slot>
            <div>
        `
    )}
</template>
`;
