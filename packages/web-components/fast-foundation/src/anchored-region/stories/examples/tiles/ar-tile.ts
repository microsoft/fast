import { Updates } from "@microsoft/fast-element";
import {
    attr,
    css,
    ElementViewTemplate,
    html,
    observable,
    ref,
} from "@microsoft/fast-element";
import { eventMouseMove, eventMouseUp } from "@microsoft/fast-web-utilities";
import type {
    HorizontalPosition,
    VerticalPosition,
} from "src/anchored-region/anchored-region.options.js";
import type { AxisPositioningMode } from "src/index.js";
import { FASTAnchoredRegion } from "../../../anchored-region.js";
import type { ARSocket } from "./ar-socket.js";

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

export interface TileData {
    title: string;
    value: number;
    fixed?: boolean;
    gridX?: number;
    gridY?: number;
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

    @observable
    public dragging: boolean = false;
    public draggingChanged(): void {
        this.classList.toggle("dragging", this.dragging);
    }

    @attr
    public fixed: boolean = false;
    public fixedChanged(): void {}

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
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.lastMouseEvent = null;
        this.sockets.splice(0, this.sockets.length);
        this.sockets.forEach(socket => {
            socket.parentTile = undefined;
        });
    }

    /**
     *
     */
    public handleMouseDown = (e: MouseEvent): void => {
        if (e.defaultPrevented || this.fixed) {
            return;
        }
        e.preventDefault();
        this.dragging = true;
        this.style.pointerEvents = "none";
        window.addEventListener(eventMouseMove, this.handleMouseMove);
        window.addEventListener(eventMouseUp, this.handleMouseUp);
        this.lastMouseEvent = e;
        this.$emit("dragtilestart", { tile: this, event: e }, { composed: true });
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
        <template @mousedown="${(x, c) => x.handleMouseDown(c.event as MouseEvent)}">
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
            <div class="content">
                <slot></slot>
            </div>
        </template>
    `;
}

export const arTileStyles = css`
    :host {
        display: block;
        display: grid;
        user-select: none;
        grid-template-columns: 10px 20px 10px;
        grid-template-rows: 10px 20px 10px;
    }

    :host(.loaded) {
        transition: transform 0.2s ease-out;
    }

    :host(.dragging) {
        transition: unset;
        z-index: 100;
        pointer-events: none;
    }

    .socket-top .socket-right .socket-bottom .socket-left {
        box-sizing: border-box;
    }

    .socket-top {
        grid-row: 1;
        grid-column: 1 / 4;
    }
    .socket-right {
        grid-row: 1 / 4;
        grid-column: 3;
    }
    .socket-bottom {
        grid-row: 3;
        grid-column: 1 / 4;
    }
    .socket-left {
        grid-row: 1 / 4;
        grid-column: 1;
    }
    .content {
        height: 40px;
        width: 40px;
        background: gray;
        border: solid 1px black;
        box-sizing: border-box;
        padding: 4px;
        display: flex;
        justify-content: center;
        font-size: 24px;
        grid-row: 1 / 4;
        grid-column: 1 / 4;
    }
`;
