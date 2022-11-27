import {
    css,
    ElementViewTemplate,
    html,
    observable,
    ref,
    Updates,
} from "@microsoft/fast-element";
import { eventMouseMove, eventMouseUp } from "@microsoft/fast-web-utilities";
import type {
    AutoUpdateMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "src/anchored-region/anchored-region.options.js";
import type { AxisPositioningMode } from "src/index.js";
import { FASTAnchoredRegion } from "../../../anchored-region.js";
import type { ARSocket } from "./ar-socket.js";
import type { TileData } from "./interfaces.js";

export function registerARTile() {
    ARTile.define({
        name: "ar-tile",
        template: arTileTemplate(),
        styles: arTileStyles,
    });
}

export interface tileDragEventArgs {
    tile: ARTile;
    event: MouseEvent;
}

/**
 *
 *
 * @public
 */
export class ARTile extends FASTAnchoredRegion {
    @observable
    public tileData: TileData;

    public horizontalPositioningMode: AxisPositioningMode = "locktodefault";
    public verticalPositioningMode: AxisPositioningMode = "locktodefault";
    public verticalDefaultPosition: VerticalPosition = "center";
    public horizontalDefaultPosition: HorizontalPosition = "center";
    public horizontalScaling: AxisScalingMode = "anchor";
    public verticalScaling: AxisScalingMode = "anchor";

    @observable
    public dragging: boolean = false;
    public draggingChanged(): void {
        this.classList.toggle("dragging", this.dragging);
    }

    public socketTop: ARSocket;
    public socketRight: ARSocket;
    public socketBottom: ARSocket;
    public socketLeft: ARSocket;
    public sockets: ARSocket[] = [];

    private updateQueued: boolean = false;
    private lastMouseEvent: MouseEvent | null = null;

    public connectedCallback(): void {
        super.connectedCallback();
        this.sockets.push(
            this.socketBottom,
            this.socketLeft,
            this.socketTop,
            this.socketRight
        );
        this.sockets.forEach(socket => {
            socket.parentTile = this;
        });
        this.addEventListener("transitionend", this.handleTransitionEnd);
        this.classList.toggle("fixed", this.tileData.fixed === true);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.lastMouseEvent = null;
        this.sockets.splice(0, this.sockets.length);
        this.sockets.forEach(socket => {
            socket.parentTile = undefined;
        });
        this.removeEventListener("transitionend", this.handleTransitionEnd);
    }

    /**
     *
     */
    public handleMouseDown = (e: MouseEvent): void => {
        if (e.defaultPrevented || this.tileData.fixed) {
            return;
        }
        e.preventDefault();
        this.dragging = true;
        this.style.pointerEvents = "none";
        window.addEventListener(eventMouseMove, this.handleMouseMove);
        window.addEventListener(eventMouseUp, this.handleMouseUp);
        this.lastMouseEvent = e;
        this.$emit("dragtilestart", { tile: this, event: e });
        this.updatePosition();
    };

    /**
     *
     */
    public handleMouseUp = (e: MouseEvent): void => {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.dragging = false;
        this.style.pointerEvents = "auto";
        window.removeEventListener(eventMouseMove, this.handleMouseMove);
        window.removeEventListener(eventMouseUp, this.handleMouseUp);
        this.lastMouseEvent = e;
        this.updatePosition();
        this.$emit("dragtileend", { tile: this, event: e }, { composed: true });
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

    public handleTransitionEnd = (e: TransitionEvent): void => {
        this.update();
    };

    private updatePosition() {
        this.updateQueued = false;
        if (!this.lastMouseEvent) {
            return;
        }

        this.virtualAnchorX =
            this.lastMouseEvent.pageX - document.documentElement.scrollLeft;
        this.virtualAnchorY =
            this.lastMouseEvent.pageY - document.documentElement.scrollTop;

        this.$emit(
            "dragtile",
            { tile: this, event: this.lastMouseEvent },
            { bubbles: false }
        );

        this.lastMouseEvent = null;
    }
}

/**
 * The template
 * @public
 */
export function arTileTemplate<T extends ARTile>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <ar-socket
                socket-facing="top"
                class="socket-top"
                ${ref("socketTop")}
            ></ar-socket>
            <ar-socket
                socket-facing="right"
                class="socket-right"
                ${ref("socketRight")}
            ></ar-socket>
            <ar-socket
                socket-facing="bottom"
                class="socket-bottom"
                ${ref("socketBottom")}
            ></ar-socket>
            <ar-socket
                socket-facing="left"
                class="socket-left"
                ${ref("socketLeft")}
            ></ar-socket>
            <div
                class="content"
                @mousedown="${(x, c) => x.handleMouseDown(c.event as MouseEvent)}"
            >
                <span class="title">
                    ${x => x.tileData.title}
                </span>
                <span class="value">
                    ${x => x.tileData.value}
                </span>
            </div>
        </template>
    `;
}

export const arTileStyles = css`
    :host {
        display: grid;
        user-select: none;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }

    :host(.loaded) {
        transition: transform 0.2s ease-in;
    }

    :host(.dragging) {
        opacity: 0.8;
        transition: unset;
        z-index: 100;
        pointer-events: none;
    }

    :host(.hilite) .content,
    :host(.fixed.hilite) .content {
        background: orange;
    }

    .socket-top,
    .socket-right,
    .socket-bottom,
    .socket-left {
        position: absolute;
        height: 36px;
        width: 36px;
    }

    .socket-top {
        transform: translate(2px, -38px) !important;
    }
    .socket-right {
        transform: translate(42px, 2px) !important;
    }
    .socket-bottom {
        transform: translate(2px, 42px) !important;
    }
    .socket-left {
        transform: translate(-38px, 2px) !important;
    }
    .content {
        background: gray;
        border: solid 1px black;
        box-sizing: border-box;
        padding: 4px;
        display: flex;
        justify-content: center;
    }

    .title {
        margin: 4px;
        font-size: 20px;
    }

    .value {
        font-size: 8px;
    }

    :host(.fixed) .content {
        background: blue;
    }
`;
