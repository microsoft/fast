import { css, ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../../anchored-region.js";

/**
 *
 *
 * @public
 */
export class AnchoredRegionPointer extends FASTAnchoredRegion {
    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public getRotation(
        anchorRect: DOMRect | undefined,
        regionRect: DOMRect | undefined
    ): number {
        if (!anchorRect || !regionRect) {
            return 0;
        }

        const anchorX: number = anchorRect.top + anchorRect.height / 2;
        const anchorY: number = anchorRect.left + anchorRect.width / 2;
        const regionX: number = regionRect.top + regionRect.height / 2;
        const regionY: number = regionRect.left + regionRect.width / 2;

        const dx = anchorX - regionX;
        const dy = regionY - anchorY;
        return (Math.atan2(dy, dx) * 180) / Math.PI + 180;
    }

    private updatePosition(e: MouseEvent) {
        this.pointAnchorX = e.pageX - document.documentElement.scrollLeft;
        this.pointAnchorY = e.pageY - document.documentElement.scrollTop;
    }
}

/**
 * The template
 * @public
 */
export function anchoredRegionPointerTemplate<
    T extends AnchoredRegionPointer
>(): ElementViewTemplate<T> {
    return html<T>`
        <template data-loaded="${x => (x.initialLayoutComplete ? "loaded" : "")}">
            ${when(
                x => x.initialLayoutComplete,
                html<T>`
                    <div
                        class="pointer"
                        style="transform:rotate(${x =>
                            x.getRotation(x.anchorRect, x.regionRect)}deg);"
                    >
                        <slot name="pointer"></slot>
                    </div>
                    <slot></slot>
                `
            )}
        </template>
    `;
}

export const anchoredRegionPointerStyles = css`
    :host {
        display: block;
        box-sizing: border-box;
    }
    .pointer {
        position: absolute;
        transform-origin: 50% 50%;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: 1fr auto 1fr;
    }
`;
