import { Updates } from "@microsoft/fast-element";
import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
    when,
} from "@microsoft/fast-element";
import { eventMouseMove, eventMouseUp } from "@microsoft/fast-web-utilities";
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

/**
 *
 *
 * @public
 */
export class ARTile extends FASTElement {
    @observable
    public items: object[];

    @observable
    public isDragging: boolean = false;

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
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.lastMouseEvent = null;
        this.sockets.splice(0, this.sockets.length);
    }

    /**
     *
     */
    public handleMouseDown = (e: MouseEvent): void => {
        this.isDragging = true;
        this.style.pointerEvents = "none";
        window.addEventListener(eventMouseMove, this.handleMouseMove, { passive: true });
        document.addEventListener(eventMouseUp, this.handleMouseUp);
        this.lastMouseEvent = e;
        this.updatePosition();
        this.$emit("dragtilestart", { tile: this, event: e }, { composed: true });
    };

    /**
     *
     */
    public handleMouseUp = (e: MouseEvent): void => {
        this.isDragging = false;
        this.style.pointerEvents = "auto";
        window.removeEventListener(eventMouseMove, this.handleMouseMove);
        document.removeEventListener(eventMouseUp, this.handleMouseUp);
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
        this.style.transform = `translate(${
            this.lastMouseEvent.pageX -
            document.documentElement.scrollLeft -
            this.offsetLeft
        }px, ${
            this.lastMouseEvent.pageY -
            document.documentElement.scrollTop -
            this.offsetTop
        }px)`;
        this.$emit(
            "positionchange",
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
        <template
            @mousedown="${(x, c) => x.handleMouseDown(c.event as MouseEvent)}"
            @mouseup="${(x, c) => x.handleMouseUp(c.event as MouseEvent)}"
        >
            <ar-socket class="socket-top" ${ref("socketTop")}></ar-socket>
            <ar-socket class="socket-right" ${ref("socketRight")}></ar-socket>
            <ar-socket class="socket-bottom" ${ref("socketBottom")}></ar-socket>
            <ar-socket class="socket-left" ${ref("socketLeft")}></ar-socket>
        </template>
    `;
}

export const arTileStyles = css`
    :host {
        height: 100px;
        width: 100px;
        display: grid;
        grid-template-columns: 20px 1fr 20px;
        grid-template-rows: 20px 1fr 20px;
        background: gray;
    }

    .socket-top .socket-right .socket-bottom .socket-left {
        background: white;s
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
`;
