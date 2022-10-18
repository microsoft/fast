import {
    attr,
    css,
    ElementViewTemplate,
    html,
    observable,
    Updates,
    when,
} from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../../../anchored-region.js";
import type { ARTile } from "./ar-tile.js";

export function registerARSocket() {
    ARSocket.define({
        name: "ar-socket",
        template: arSocketTemplate(),
        styles: arSocketStyles,
    });
}

/**
 *
 * @public
 */
export const SocketFacing = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    center: "center",
} as const;

/**
 *
 *
 * @public
 */
export type SocketFacing = typeof SocketFacing[keyof typeof SocketFacing];

/**
 *
 *
 * @public
 */
export class ARSocket extends FASTAnchoredRegion {
    @attr({ attribute: "socket-facing" })
    public socketFacing: SocketFacing = "right";

    @observable
    public socketActive: boolean = false;
    public socketActiveChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.socketActive) {
            this.addEventListener("mouseenter", this.handleMouseEnter);
            this.addEventListener("mouseleave", this.handleMouseLeave);
        } else {
            this.removeEventListener("mouseenter", this.handleMouseEnter);
            this.removeEventListener("mouseleave", this.handleMouseLeave);
            this.socketHovered = false;
        }
    }

    @observable
    public socketHovered: boolean = false;
    public socketHoveredChanged(): void {
        this.classList.toggle("preview", this.socketHovered);
    }

    public parentTile: ARTile | undefined;
    public childTile: ARTile | undefined;

    public connectedCallback(): void {
        super.connectedCallback();
        this.useVirtualAnchor = true;
        Updates.enqueue(() => {
            this.$emit("socketconnected", this);
        });
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.$emit("socketdisconnected", this);
        this.parentTile = undefined;
        this.childTile = undefined;
    }

    public handleMouseEnter = (e: MouseEvent): void => {
        this.socketHovered = true;
        this.$emit("sockethovered", this);
    };

    public handleMouseLeave = (e: MouseEvent): void => {
        this.socketHovered = false;
        this.$emit("socketunhovered", this);
    };

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

    public getDistance(
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

        return Math.hypot(anchorX - regionX, anchorY - regionY);
    }
}

/**
 * The template
 * @public
 */
export function arSocketTemplate<T extends ARSocket>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            ${when(
                x => x.initialLayoutComplete && x.socketActive,
                html<T>`
                    <div
                        class="pointer"
                        style="
                    transform:rotate(${x =>
                            x.getRotation(x.anchorRect, x.regionRect)}deg);
                    opacity:${x =>
                            (200 - x.getDistance(x.anchorRect, x.regionRect)) / 200};
                "
                    ></div>
                `
            )}
        </template>
    `;
}

export const arSocketStyles = css`
    :host {
        display: grid;
        grid-template-columns: 1fr 10px 1fr;
        grid-template-rows: 1fr 10px 1fr;
    }
    :host(.preview) {
        background: green;
    }
    .pointer {
        border-radius: 50%;
        background: blue;
        grid-row: 2;
        grid-column: 2;
        will-change: transform, opacity;
        position: absolute;
        transform-origin: 50% 50%;
        height: 10px;
        width: 10px;
    }
`;
