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

/**
 * The template
 * @public
 */
export function arLockIntoViewTemplate<T extends ARLockIntoView>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <template style="height:100%; width:100%; overflow: auto;">
            <h1>
                Lock into view
            </h1>
            ${sectionDividerTemplate}
                The "lock into view" attributes keep the region in the viewport on the
                specified axis.  There is significant flexibility as to what other element
                is the viewport.
            ${sectionDividerTemplate}
            <draggable-anchor
                fixed-placement="true"
                class="anchor"
                id="anchor"
                point-anchor-x="150"
                point-anchor-Y="150"
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
                    id="grid-cell-1"
                >
                    <fast-anchored-region
                        class="tracking-region"
                        anchor="anchor"
                        viewport="grid-cell-1"
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
                        <div
                            class="tracker1"
                        >
                        </div>
                    </fast-anchored-region>
                </div>
                <div
                    style="grid-column: 2; grid-row: 1;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
                </div>
                <div
                    style="grid-column: 3; grid-row: 1;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
                </div>
                <div
                    style="grid-column: 1; grid-row: 2;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
                </div>
                <div
                    style="grid-column: 3; grid-row: 2;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
                </div>
                <div
                    style="grid-column: 1; grid-row: 3;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
                </div>
                <div
                    style="grid-column: 2; grid-row: 3;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
                </div>
                <div
                    style="grid-column: 3; grid-row: 3;"
                    class="grid-cell"
                    id="grid-cell-1"
                >
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
    }
    .tracker1 {
        background: grey;
        opacity: 0.5;
        border: solid green 2px;
        height: 100px;
        width: 100px;
    }
`;
