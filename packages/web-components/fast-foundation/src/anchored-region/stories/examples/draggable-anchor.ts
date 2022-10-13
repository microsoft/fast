import { Updates } from "@microsoft/fast-element";
import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    when,
} from "@microsoft/fast-element";
import { eventMouseMove, eventMouseUp } from "@microsoft/fast-web-utilities";

/**
 *
 *
 * @public
 */
export class DraggableAnchor extends FASTElement {
    @observable
    public isDragging: boolean = false;

    private updateQueued: boolean = false;
    private lastMouseEvent: MouseEvent | null = null;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.lastMouseEvent = null;
    }

    /**
     *
     */
    private handleMouseDown = (e: MouseEvent): void => {
        this.isDragging = true;
        window.addEventListener(eventMouseMove, this.handleMouseMove);
        document.addEventListener(eventMouseUp, this.handleMouseUp);
        this.lastMouseEvent = e;
        this.updatePosition();
    };

    /**
     *
     */
    public handleMouseUp = (e: MouseEvent): void => {
        this.isDragging = false;
        window.removeEventListener(eventMouseMove, this.handleMouseMove);
        document.removeEventListener(eventMouseUp, this.handleMouseUp);
        this.lastMouseEvent = e;
        this.updatePosition();
    };

    /**
     * handles mouse move events when in mouse tracking mode
     */
    public handleMouseMove = (e: MouseEvent): void => {
        this.lastMouseEvent = e;
        if (this.updateQueued) {
            return;
        }
        this.updateQueued = true;
        Updates.enqueue(() => this.updatePosition());
    };

    private updatePosition() {
        this.updateQueued = false;
        if (!this.lastMouseEvent) {
            return;
        }
        this.style.transform = `translate(${
            this.lastMouseEvent.pageX -
            document.documentElement.scrollLeft -
            this.offsetLeft
        }px, ${
            this.lastMouseEvent.pageY -
            document.documentElement.scrollTop -
            this.offsetTop
        }px)`;
        this.lastMouseEvent = null;
        this.$emit("positionchange", this, { bubbles: false });
        // this.pointAnchorX = e.pageX - document.documentElement.scrollLeft;
        // this.pointAnchorY = e.pageY - document.documentElement.scrollTop;
    }
}

/**
 * The template
 * @public
 */
export function draggableAnchorTemplate<T extends DraggableAnchor>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <template>
            <fast-button
                @mousedown="${(x, c) => x.handleMouseDown(c.event as MouseEvent)}"
                @mouseup="${(x, c) => x.handleMouseUp(c.event as MouseEvent)}"
            >
                <slot></slot>
            </fast-button>
        </template>
    `;
}

export const draggableAnchorStyles = css`
    :host {
        display: block;
        position: fixed;
    }
`;
