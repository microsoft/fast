import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
    when,
} from "@microsoft/fast-element";
import type { FASTAnchoredRegion } from "../../anchored-region.js";
import type { DraggableAnchor } from "./draggable-anchor.js";

export const ArPositions = {
    dynamic: "dynamic",
    fillLocked: "fillLocked",
} as const;

export type ArPositions = typeof ArPositions[keyof typeof ArPositions];

/**
 *
 *
 * @public
 */
export class ARPositionDemo extends FASTElement {
    @observable
    public anchorElement: DraggableAnchor;

    @observable
    public positions: ArPositions = "fillLocked";

    public connectedCallback(): void {
        super.connectedCallback();
        this.anchorElement.addEventListener("positionchange", this.handleAnchorMove);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public handleAnchorMove = (): void => {
        const subRegions = this.shadowRoot?.querySelectorAll(".subregion");
        subRegions?.forEach(element => {
            ((element as any) as FASTAnchoredRegion).update();
        });
    };
}

/**
 * The template
 * @public
 */
export function arPositionDemoTemplate<T extends ARPositionDemo>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <template style="height:100%; width:100%;">
            ${when(
                x => x.positions === "fillLocked",
                html<T>`
                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="left"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="fill"
                        vertical-default-position="top"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        <div
                            style="background: green; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            top-left
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="fill"
                        vertical-default-position="top"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        <div
                            style="background: green; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            top-right
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="left"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="fill"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        <div
                            style="background: green; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            bottom-left
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="fill"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        <div
                            style="background: green; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            bottom-right
                        </div>
                    </fast-anchored-region>
                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="fill"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="anchor"
                    >
                        <div
                            style="background: blue; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            center-right
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="left"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="fill"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="anchor"
                    >
                        <div
                            style="background: blue; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            center-left
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="anchor"
                        vertical-default-position="top"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        <div
                            style="background: blue; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            top-center
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        <div
                            style="background: blue; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            bottom-center
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        <div
                            style="background: orange; opacity:0.5; padding: 10px; height: 200px; width: 200px; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            centered
                        </div>
                    </fast-anchored-region>
                `
            )}
            ${when(
                x => x.positions === "dynamic",
                html<T>`
                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-positioning-mode="dynamic"
                        horizontal-scaling="content"
                        vertical-default-position="center"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        <div
                            style="background: green; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            right or left
                        </div>
                    </fast-anchored-region>

                    <fast-anchored-region
                        anchor="anchor"
                        class="subregion"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="content"
                        vertical-positioning-mode="dynamic"
                        vertical-scaling="content"
                    >
                        <div
                            style="background: green; opacity:0.5; padding: 10px; height: 100%; width: 100%; box-sizing: border-box; border: solid 4px; border-color: black;"
                        >
                            top or bottom
                        </div>
                    </fast-anchored-region>
                `
            )}
            <draggable-anchor
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
        </template>
    `;
}

export const arPositionDemoStyles = css`
    :host {
        display: block;
    }
`;
