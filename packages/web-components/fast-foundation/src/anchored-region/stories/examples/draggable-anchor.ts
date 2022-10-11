import {
    ElementViewTemplate,
    html,
    observable,
    Updates,
    when,
} from "@microsoft/fast-element";
import { eventMouseMove } from "@microsoft/fast-web-utilities";
import { FASTAnchoredRegion } from "../../anchored-region.js";

/**
 *
 *
 * @public
 */
export class DraggableAnchor extends FASTAnchoredRegion {
    @observable
    public isDragging: boolean = false;

    public connectedCallback(): void {
        super.connectedCallback();
        this.usePointAnchor = true;
        this.autoUpdateMode = "auto";
        this.horizontalDefaultPosition = "right";
        this.verticalDefaultPosition = "bottom";
        this.horizontalPositioningMode = "locktodefault";
        this.verticalPositioningMode = "locktodefault";
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    /**
     *
     */
    private handleMouseDown = (e: MouseEvent): void => {
        this.isDragging = true;
        window.addEventListener(eventMouseMove, this.handleMouseMove);
    };

    /**
     *
     */
    public handleMouseUp = (e: MouseEvent): void => {
        this.isDragging = false;
        window.removeEventListener(eventMouseMove, this.handleMouseMove);
        this.updatePosition(e);
    };

    /**
     * handles mouse move events when in mouse tracking mode
     */
    public handleMouseMove = (e: MouseEvent): void => {
        this.updatePosition(e);
    };

    private updatePosition(e: MouseEvent) {
        this.pointAnchorX = e.pageX - document.documentElement.scrollLeft;
        this.pointAnchorY = e.pageY - document.documentElement.scrollTop;
        this.$emit("anchor-moved");
    }
}

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTAnchoredRegion:class)} component.
 * @public
 */
export function draggableAnchorTemplate<T extends DraggableAnchor>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <template data-loaded="${x => (x.initialLayoutComplete ? "loaded" : "")}">
            ${when(
                x => x.initialLayoutComplete,
                html<T>`
                    <button
                        @mousedown="${(x, c) => x.handleMouseDown(c.event as MouseEvent)}"
                        @mouseup="${(x, c) => x.handleMouseUp(c.event as MouseEvent)}"
                    >
                        <slot></slot>
                    </button>
                `
            )}
        </template>
    `;
}
