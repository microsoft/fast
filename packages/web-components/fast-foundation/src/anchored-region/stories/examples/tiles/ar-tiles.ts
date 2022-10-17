import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
} from "@microsoft/fast-element";
import { ARTile, registerARTile, tileDragEventArgs } from "./ar-tile.js";
import { registerARConnector } from "./ar-connector.js";
import { ARSocket, registerARSocket } from "./ar-socket.js";

export function registerARTiles() {
    ARTiles.define({
        name: "ar-tiles",
        template: arTilesTemplate(),
        styles: arTilesStyles,
    });
    registerARTile();
    registerARConnector();
    registerARSocket();
}

/**
 *
 *
 * @public
 */
export class ARTiles extends FASTElement {
    private allSockets: ARSocket[] = [];
    private activeSockets: ARSocket[] = [];

    private currentDragTile: ARTile | undefined;

    private hoverSocket: ARSocket | undefined;

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("socketconnected", this.handleSocketConnected);
        this.addEventListener("socketdisconnected", this.handleSocketDisconnected);
        this.addEventListener("dragtilestart", this.handleDragTileStart);
        this.addEventListener("dragtileend", this.handleDragTileEnd);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("socketconnected", this.handleSocketConnected);
        this.removeEventListener("socketdisconnected", this.handleSocketDisconnected);
        this.removeEventListener("dragtilestart", this.handleDragTileStart);
        this.removeEventListener("dragtileend", this.handleDragTileEnd);
        this.allSockets.splice(0, this.allSockets.length);
        this.currentDragTile = undefined;
        this.hoverSocket = undefined;
    }

    public handleDragTileStart = (e: CustomEvent): void => {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        const detail = e.detail as tileDragEventArgs;
        this.currentDragTile = detail.tile;
        if (this.currentDragTile === undefined) {
            return;
        }
        this.addEventListener("sockethovered", this.handleSocketHovered);
        this.addEventListener("socketunhovered", this.handleSocketUnhovered);
        this.currentDragTile.addEventListener("dragtile", this.handleTileDrag);
        this.allSockets.forEach(socket => {
            if (!this.currentDragTile.sockets.includes(socket)) {
                socket.socketActive = true;
                this.activeSockets.push(socket);
            }
        });
        this.updateActiveSockets(detail);
    };

    public handleDragTileEnd = (e: CustomEvent): void => {
        if (e.defaultPrevented || !this.currentDragTile) {
            return;
        }
        e.preventDefault();
        this.removeEventListener("sockethovered", this.handleSocketHovered);
        this.removeEventListener("socketunhovered", this.handleSocketUnhovered);
        this.updateActiveSockets(e.detail as tileDragEventArgs);
        this.activeSockets.forEach(socket => {
            socket.anchorElement = null;
            socket.socketActive = false;
        });
        this.activeSockets.splice(0, this.activeSockets.length);
        this.currentDragTile.removeEventListener("dragtile", this.handleTileDrag);
        this.currentDragTile = undefined;
    };

    public handleTileDrag = (e: CustomEvent): void => {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.updateActiveSockets(e.detail as tileDragEventArgs);
    };
    private updateActiveSockets(detail: tileDragEventArgs): void {
        this.activeSockets.forEach(socket => {
            socket.virtualAnchorX = detail.event.pageX;
            socket.virtualAnchorY = detail.event.pageY;
        });
    }

    public handleSocketConnected = (e: CustomEvent): void => {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.allSockets.push(e.detail as ARSocket);
    };

    public handleSocketDisconnected = (e: CustomEvent): void => {
        if (e.defaultPrevented || !e.target) {
            return;
        }
        e.preventDefault();
        const socket: ARSocket = e.detail as ARSocket;
        if (this.allSockets.includes(socket)) {
            this.allSockets.splice(this.allSockets.indexOf(socket), 1);
        }
        if (this.activeSockets.includes(socket)) {
            this.activeSockets.splice(this.activeSockets.indexOf(socket as ARSocket), 1);
        }
    };

    public handleSocketHovered = (e: CustomEvent): void => {
        if (e.defaultPrevented || !e.target || !this.currentDragTile) {
            return;
        }
        e.preventDefault();
        this.hoverSocket = e.detail as ARSocket;
        this.currentDragTile.useVirtualAnchor = false;
        this.currentDragTile.anchorElement = this.hoverSocket;
        switch (this.hoverSocket.socketFacing) {
            case "left":
                this.currentDragTile.horizontalDefaultPosition = "left";
                this.currentDragTile.verticalDefaultPosition = "center";
                break;
            case "right":
                this.currentDragTile.horizontalDefaultPosition = "right";
                this.currentDragTile.verticalDefaultPosition = "center";
                break;
            case "top":
                this.currentDragTile.horizontalDefaultPosition = "center";
                this.currentDragTile.verticalDefaultPosition = "top";
                break;
            case "bottom":
                this.currentDragTile.horizontalDefaultPosition = "center";
                this.currentDragTile.verticalDefaultPosition = "bottom";
                break;
            case "center":
                this.currentDragTile.horizontalDefaultPosition = "center";
                this.currentDragTile.verticalDefaultPosition = "center";
                break;
        }
    };

    public handleSocketUnhovered = (e: CustomEvent): void => {
        if (e.defaultPrevented || !e.target) {
            return;
        }
        e.preventDefault();
        this.hoverSocket = undefined;
        this.currentDragTile.useVirtualAnchor = true;
        this.currentDragTile.anchorElement = null;
        this.currentDragTile.horizontalDefaultPosition = "right";
        this.currentDragTile.verticalDefaultPosition = "bottom";
    };
}

const sectionDividerTemplate = html`
    <fast-divider style="margin:20px;"></fast-divider>
`;

/**
 * The template
 * @public
 */
export function arTilesTemplate<T extends ARTiles>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <h1>
                Tiles
            </h1>
            ${sectionDividerTemplate} Blah ${sectionDividerTemplate}
            <div id="board" class="board">
                <div id="canvas" class="canvas">
                    <ar-socket socket-facing="center" class="start">
                        Start
                    </ar-socket>
                </div>
                <div id="hand" class="hand">
                    <ar-socket id="dispenser-1" socket-facing="center" class="dispenser">
                        A
                    </ar-socket>
                    <ar-socket id="dispenser-2" socket-facing="center" class="dispenser">
                        B
                    </ar-socket>
                </div>

                <ar-tile
                    anchor="dispenser-1"
                    viewport="board"
                    vertical-viewport-lock="true"
                    horizontal-viewport-lock="true"
                >
                    A
                </ar-tile>
                <ar-tile
                    anchor="dispenser-2"
                    viewport="board"
                    vertical-viewport-lock="true"
                    horizontal-viewport-lock="true"
                >
                    B
                </ar-tile>
            </div>
        </template>
    `;
}

export const arTilesStyles = css`
    :host {
    }

    .start {
        position: absolute;
        left: 350px;
        top: 180px;
        background: green;
        height: 60px;
        width: 60px;
    }

    .dispenser {
        margin: 5px;
        background: brown;
        height: 60px;
        width: 60px;
    }

    .board {
        height: 600px;
        position: relative;
        display: grid;
        grid-template-columns: 10px 1fr 10px;
        grid-template-rows: 10px 1fr 10px 150px 10px;
    }

    .canvas {
        grid-row: 2;
        grid-column: 2;
        width: 100%;
        height: 100%;
        background: lightgray;
    }

    .hand {
        position: relative;
        grid-row: 4;
        grid-column: 2;
        background: lightgray;
        display: flex;
        gap; 10px;
        flex-wrap: wrap;
    }
`;
