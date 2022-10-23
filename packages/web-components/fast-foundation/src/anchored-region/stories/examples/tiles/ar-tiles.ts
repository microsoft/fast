import {
    bind,
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
    RepeatDirective,
    Updates,
    ViewBehaviorOrchestrator,
    ViewTemplate,
} from "@microsoft/fast-element";
import { ARTile, registerARTile, tileDragEventArgs } from "./ar-tile.js";
import { ARSocket, registerARSocket } from "./ar-socket.js";

export function registerARTiles() {
    ARTiles.define({
        name: "ar-tiles",
        template: arTilesTemplate(),
        styles: arTilesStyles,
    });
    registerARTile();
    registerARSocket();
}

export interface TileData {
    title: string;
    value: number;
}

/**
 *
 *
 * @public
 */
export class ARTiles extends FASTElement {
    @observable
    public tiles: TileData[] = [
        { title: "A", value: 1 },
        { title: "B", value: 1 },
        { title: "C", value: 1 },
        { title: "D", value: 1 },
        { title: "E", value: 1 },
        { title: "F", value: 1 },
        { title: "G", value: 1 },
        { title: "H", value: 1 },
        { title: "I", value: 1 },
        { title: "J", value: 1 },
        { title: "K", value: 1 },
        { title: "L", value: 1 },
        { title: "M", value: 1 },
        { title: "N", value: 1 },
        { title: "O", value: 1 },
        { title: "P", value: 1 },
        { title: "Q", value: 1 },
        { title: "R", value: 1 },
        { title: "S", value: 1 },
        { title: "T", value: 1 },
        { title: "U", value: 1 },
        { title: "V", value: 1 },
        { title: "W", value: 1 },
        { title: "X", value: 1 },
        { title: "Y", value: 1 },
        { title: "Z", value: 1 },
    ];

    public board: HTMLDivElement;
    public canvas: HTMLDivElement;
    public hand: HTMLDivElement;
    private allSockets: ARSocket[] = [];
    private activeSockets: ARSocket[] = [];
    private placedTiles: ARTile[] = [];

    private currentDragTile: ARTile | undefined;
    private dragTileOriginalSocket: ARSocket | undefined;

    private hoverSocket: ARSocket | undefined;
    private behaviorOrchestrator: ViewBehaviorOrchestrator | null = null;
    private dispenserPlaceholder: Node | null = null;
    private tilePlaceholder: Node | null = null;

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("socketconnected", this.handleSocketConnected);
        this.addEventListener("socketdisconnected", this.handleSocketDisconnected);
        this.addEventListener("dragtilestart", this.handleDragTileStart);
        this.addEventListener("dragtileend", this.handleDragTileEnd);
        this.dispenserPlaceholder = document.createComment("");
        this.tilePlaceholder = document.createComment("");
        if (this.behaviorOrchestrator === null) {
            this.behaviorOrchestrator = ViewBehaviorOrchestrator.create(this);
            this.$fastController.addBehavior(this.behaviorOrchestrator);
            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.tiles, false),
                    bind(x => dispenserTemplate, false),
                    { positioning: true }
                ),
                this.hand.appendChild(this.dispenserPlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.tiles, false),
                    bind(x => letterTileTemplate, false),
                    { positioning: true }
                ),
                this.board.appendChild(this.tilePlaceholder)
            );
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("socketconnected", this.handleSocketConnected);
        this.removeEventListener("socketdisconnected", this.handleSocketDisconnected);
        this.removeEventListener("dragtilestart", this.handleDragTileStart);
        this.removeEventListener("dragtileend", this.handleDragTileEnd);
        this.allSockets.splice(0, this.allSockets.length);
        this.activeSockets.splice(0, this.activeSockets.length);
        this.placedTiles.splice(0, this.placedTiles.length);
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
        if (detail.tile.anchorElement) {
            this.dragTileOriginalSocket = detail.tile.anchorElement as ARSocket;
            this.dragTileOriginalSocket.connectedTile = undefined;
        }
        if (this.currentDragTile === undefined) {
            return;
        }
        this.addEventListener("sockethovered", this.handleSocketHovered);
        this.addEventListener("socketunhovered", this.handleSocketUnhovered);
        this.currentDragTile.addEventListener("dragtile", this.handleTileDrag);
        this.currentDragTile.useVirtualAnchor = true;
        this.currentDragTile.horizontalDefaultPosition = "right";
        this.currentDragTile.verticalDefaultPosition = "bottom";
        this.placedTiles.forEach(tile => {
            tile.update();
            tile.sockets.forEach(socket => {
                socket.update();
            });
        });
        this.currentDragTile.addEventListener(
            "positionchange",
            this.handleDragTilePositionChange
        );
    };

    public handleDragTilePositionChange = (): void => {
        this.currentDragTile?.removeEventListener(
            "positionchange",
            this.handleDragTilePositionChange
        );
        Updates.enqueue(() => {
            this.allSockets.forEach(socket => {
                if (this.isValidSocket(socket)) {
                    socket.socketActive = true;
                    this.activeSockets.push(socket);
                }
            });
        });
    };

    public handleDragTileEnd = (e: CustomEvent): void => {
        if (e.defaultPrevented || !this.currentDragTile) {
            return;
        }
        e.preventDefault();
        if (this.hoverSocket) {
            this.setTileInSocket(this.hoverSocket, this.currentDragTile);
            if (!this.hand.contains(this.hoverSocket)) {
                this.placeTile(this.currentDragTile);
            }
        } else if (this.dragTileOriginalSocket) {
            this.setTileInSocket(this.dragTileOriginalSocket, this.currentDragTile);
        }

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
        this.dragTileOriginalSocket = undefined;
        this.hoverSocket = undefined;
    };

    private placeTile(tile: ARTile): void {
        tile.fixed = true;
        this.placedTiles.push(tile);
    }

    private isValidSocket(socket: ARSocket): boolean {
        if (
            !this.currentDragTile ||
            this.currentDragTile.sockets.includes(socket) ||
            this.hand.contains(socket) ||
            socket.connectedTile !== undefined
        ) {
            return false;
        }

        if (socket.parentTile === undefined) {
            return true;
        }

        const dropRect: DOMRect | undefined = this.getDropRect(
            socket,
            this.currentDragTile
        );
        if (!dropRect) {
            return false;
        }

        let intersecting: boolean = false;

        for (let i = 0; i < this.placedTiles.length; i++) {
            const tile: ARTile = this.placedTiles[i];
            if (tile.regionRect && this.isIntersecting(tile.regionRect, dropRect)) {
                intersecting = true;
                break;
            }
        }

        if (socket.parentTile && socket.parentTile.fixed && !intersecting) {
            return true;
        }

        return false;
    }

    private isIntersecting(rectA: DOMRect, rectB: DOMRect): boolean {
        if (
            rectA.left >= rectB.right ||
            rectA.top >= rectB.bottom ||
            rectA.right <= rectB.left ||
            rectA.bottom <= rectB.top
        ) {
            return false;
        }
        return true;
    }

    private getDropRect(socket: ARSocket, tile: ARTile): DOMRect | undefined {
        if (!socket.regionRect || !tile.regionRect) {
            return undefined;
        }

        const socketRect = socket.regionRect;
        const tileRect = tile.regionRect;
        let tileTop = 0;
        let tileLeft = 0;

        switch (socket.socketFacing) {
            case "left":
                tileTop = socketRect.top + 5;
                tileLeft = socketRect.left - tileRect.width + 5;
                break;
            case "right":
                tileTop = socketRect.top + 5;
                tileLeft = socketRect.right + 5;
                break;
            case "top":
                tileTop = socketRect.top - tileRect.height + 5;
                tileLeft = socketRect.left + 5;
                break;
            case "bottom":
                tileTop = socketRect.bottom + 5;
                tileLeft = socketRect.left + 5;
                break;
        }
        return new DOMRect(tileLeft, tileTop, tileRect.width - 10, tileRect.height - 10);
    }

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

        this.setTileInSocket(this.hoverSocket, this.currentDragTile);
    };

    private setTileInSocket(socket: ARSocket, tile: ARTile): void {
        switch (socket.socketFacing) {
            case "left":
                tile.horizontalDefaultPosition = "left";
                tile.verticalDefaultPosition = "center";
                break;
            case "right":
                tile.horizontalDefaultPosition = "right";
                tile.verticalDefaultPosition = "center";
                break;
            case "top":
                tile.horizontalDefaultPosition = "center";
                tile.verticalDefaultPosition = "top";
                break;
            case "bottom":
                tile.horizontalDefaultPosition = "center";
                tile.verticalDefaultPosition = "bottom";
                break;
            case "center":
                tile.horizontalDefaultPosition = "center";
                tile.verticalDefaultPosition = "center";
                break;
        }

        const dropRect: DOMRect | undefined = this.getDropRect(socket, tile);
        //console.debug(dropRect?.left, dropRect?.right);
        if (socket.parentTile && dropRect) {
            this.activeSockets.forEach(activeSocket => {
                const activeDropRect = this.getDropRect(activeSocket, tile);
                if (activeDropRect && this.isIntersecting(dropRect, activeDropRect)) {
                    activeSocket.connectedTile = tile;
                    switch (activeSocket.socketFacing) {
                        case "left":
                            tile.socketRight.connectedTile = activeSocket.parentTile;
                            console.debug("connect left");
                            break;
                        case "right":
                            tile.socketLeft.connectedTile = activeSocket.parentTile;
                            console.debug("connect right");
                            break;
                        case "top":
                            tile.socketBottom.connectedTile = activeSocket.parentTile;
                            console.debug("connect top");
                            break;
                        case "bottom":
                            tile.socketTop.connectedTile = activeSocket.parentTile;
                            console.debug("connect bottom");
                            break;
                    }
                }
            });
        }
        tile.useVirtualAnchor = false;
        tile.anchorElement = socket;
    }

    private removeTileFromSocket(socket: ARSocket, tile: ARTile): void {
        tile.sockets.forEach(dragTileSocket => {
            if (dragTileSocket.connectedTile) {
                dragTileSocket.connectedTile.sockets.forEach(childTileSocket => {
                    if (childTileSocket.connectedTile === tile) {
                        childTileSocket.connectedTile = undefined;
                    }
                });
                dragTileSocket.connectedTile = undefined;
            }
        });
    }

    public handleSocketUnhovered = (e: CustomEvent): void => {
        if (
            e.defaultPrevented ||
            !e.target ||
            !this.hoverSocket ||
            !this.currentDragTile
        ) {
            return;
        }
        e.preventDefault();
        this.removeTileFromSocket(this.hoverSocket, this.currentDragTile);
        this.hoverSocket = undefined;
        this.currentDragTile.useVirtualAnchor = true;
        this.currentDragTile.horizontalDefaultPosition = "right";
        this.currentDragTile.verticalDefaultPosition = "bottom";
    };
}

const sectionDividerTemplate = html`
    <fast-divider style="margin:20px;"></fast-divider>
`;

const letterTileTemplate: ViewTemplate<ARTiles> = html`
    <ar-tile
        anchor="dispenser-${(x, c) => c.index}"
        viewport="board"
        vertical-viewport-lock="true"
        horizontal-viewport-lock="true"
    >
        ${x => x.title}
    </ar-tile>
`;

const dispenserTemplate: ViewTemplate<ARTile> = html`
    <ar-socket
        id="dispenser-${(x, c) => c.index}"
        socket-facing="center"
        class="dispenser"
    ></ar-socket>
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
            <div id="board" class="board" ${ref("board")}>
                <div id="canvas" class="canvas" ${ref("canvas")}>
                    <ar-socket socket-facing="center" class="start">
                        Start
                    </ar-socket>
                </div>
                <div id="hand" class="hand" ${ref("hand")}></div>
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
        background: yellow;
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
        height: auto;
        width: 800px;
        position: relative;
        display: grid;
        grid-template-columns: 10px 1fr 10px;
        grid-template-rows: 10px auto 10px auto 10px;
    }

    .canvas {
        grid-row: 2;
        grid-column: 2;
        width: 100%;
        height: 400px;
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
