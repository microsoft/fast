import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
} from "@microsoft/fast-element";
import type { FASTAnchoredRegion } from "../../anchored-region.js";
import type { DraggableAnchor } from "./draggable-anchor.js";

/**
 *
 *
 * @public
 */
export class ARLockIntoView extends FASTElement {
    @observable
    public anchorElement: DraggableAnchor;

    public connectedCallback(): void {
        super.connectedCallback();
        this.anchorElement.addEventListener("positionchange", this.handleAnchorMove);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public handleAnchorMove = (): void => {
        const subRegions = this.shadowRoot?.querySelectorAll(".tracking-region");
        subRegions?.forEach(element => {
            ((element as any) as FASTAnchoredRegion).update();
        });
    };
}

const sectionDividerTemplate = html`
    <fast-divider style="margin:20px;"></fast-divider>
`;

const pointerElementTemplate = html`
    <div class="tracker"></div>
    <div class="pointer" slot="pointer">
        ↑
    </div>
`;

/**
 * The template
 * @public
 */
export function arLockIntoViewTemplate<T extends ARLockIntoView>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <template style="height:100%; width:100%;">
            <h1>
                Lock into view
            </h1>
            ${sectionDividerTemplate}
                The "lock into view" attributes keep the region in the viewport on the
                specified axis.  There is significant flexibility as to what other element
                is the viewport.<p>
                Anchored regions can be styled based on their placement by using the
                css classes put on the element based on position (ie. top/bottom/left/right).
                This is how the borders on the blue squares below are thicker on the anchored sides.
            ${sectionDividerTemplate}
            <draggable-anchor
                fixed-placement="true"
                class="anchor"
                id="anchor"
                point-anchor-x="300"
                point-anchor-Y="300"
                ${ref("anchorElement")}
            >
                Anchor
                <br />
                Click to Drag
            </draggable-anchor>
            <div
                class="grid"
            >
                <div
                    style="grid-column: 1; grid-row: 1;"
                    class="grid-cell"
                    id="grid-cell-1-1"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-1-1"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="left"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="top"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 2; grid-row: 1;"
                    class="grid-cell"
                    id="grid-cell-1-2"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-1-2"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="top"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 3; grid-row: 1;"
                    class="grid-cell"
                    id="grid-cell-1-3"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-1-3"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="top"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 1; grid-row: 2;"
                    class="grid-cell"
                    id="grid-cell-2-1"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-2-1"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="left"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 2; grid-row: 2;"
                    class="grid-cell"
                    id="grid-cell-2-2"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-2-2"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 3; grid-row: 2;"
                    class="grid-cell"
                    id="grid-cell-2-3"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-2-3"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 1; grid-row: 3;"
                    class="grid-cell"
                    id="grid-cell-3-1"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-3-1"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="left"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 2; grid-row: 3;"
                    class="grid-cell"
                    id="grid-cell-3-2"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-3-2"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
                <div
                    style="grid-column: 3; grid-row: 3;"
                    class="grid-cell"
                    id="grid-cell-3-3"
                >
                    <anchored-region-pointer
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-3-3"
                        auto-update-mode="auto"
                        horizontal-viewport-lock="true"
                        vertical-viewport-lock="true"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${pointerElementTemplate}
                    </anchored-region-pointer>
                </div>
            <div>
        </template>
    `;
}

export const arLockIntoViewStyles = css`
    :host {
        display: block;
    }
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        width: 100%;
        height: 600px;
    }
    .grid-cell {
        background: grey;
        border: solid;
    }
    .anchor {
        z-index: 100;
    }
    .tracking-region {
        pointer-events: none;
        background: blue;
        opacity: 0.5;
        border: solid green 2px;
    }
    .tracking-region.top {
        border-bottom-width: 8px;
    }
    .tracking-region.bottom {
        border-top-width: 8px;
    }
    .tracking-region.left {
        border-right-width: 8px;
    }
    .tracking-region.right {
        border-left-width: 8px;
    }
    .tracker {
        height: 100px;
        width: 100px;
    }
    .pointer {
        font-size: 42px;
        grid-column: 2;
        grid-row: 2;
    }
`;
