import {
    bind,
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
    RepeatDirective,
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

/**
 *
 *
 * @public
 */
export class ARTiles extends FASTElement {
    @observable
    public letters: string[] = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];

    // public letters: string[] = [
    //     "A",
    //     "B",
    // ];

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
                    bind(x => x.letters, false),
                    bind(x => dispensorTemplate, false),
                    { positioning: true }
                ),
                this.hand.appendChild(this.dispenserPlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.letters, false),
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
            this.dragTileOriginalSocket.childTile = undefined;
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
        this.allSockets.forEach(socket => {
            if (this.isValidSocket(socket)) {
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
        if (this.hoverSocket) {
            this.setTileInSocket(this.hoverSocket);
            if (!this.hand.contains(this.hoverSocket)) {
                this.currentDragTile.fixed = true;
                this.placedTiles.push(this.currentDragTile);
            }
        } else if (this.dragTileOriginalSocket) {
            this.setTileInSocket(this.dragTileOriginalSocket);
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

    private isValidSocket(socket: ARSocket): boolean {
        if (
            !this.currentDragTile ||
            this.currentDragTile.sockets.includes(socket) ||
            socket.childTile !== undefined
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
        this.placedTiles.forEach(tile => {
            // console.debug(`regionrect: ${tile.regionRect?.top},  ${tile.regionRect?.right}, ${tile.regionRect?.bottom}, ${tile.regionRect?.left}`);
            //console.debug(`droprect: ${dropRect?.top},  ${dropRect?.right}, ${dropRect?.bottom}, ${dropRect?.left}`);
            if (tile.regionRect && this.isIntersecting(tile.regionRect, dropRect)) {
                intersecting = true;
                //todo: break early
            }
            console.debug(`intersecting: ${intersecting}`);
        });

        if (socket.parentTile && socket.parentTile.fixed && !intersecting) {
            return true;
        }

        return false;
    }

    private isIntersecting(rectA: DOMRect, rectB: DOMRect): boolean {
        console.debug(
            `rectA: ${rectA.top},  ${rectA.right}, ${rectA.bottom}, ${rectA.left}`
        );
        console.debug(
            `rectB: ${rectB.top},  ${rectB.right}, ${rectB.bottom}, ${rectB.left}`
        );
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

        let tileTop: number = 0;
        let tileLeft: number = 0;
        // console.debug(`socket.regionRect: ${socket.regionRect?.top}, ${socket.regionRect?.right}, ${socket.regionRect?.bottom}, ${socket.regionRect?.left}`);

        switch (socket.socketFacing) {
            case "left":
                tileTop = socket.regionRect.top + tile.regionRect.height / 2;
                tileLeft = socket.regionRect.left - tile.regionRect.width / 2;
                break;
            case "right":
                tileTop = socket.regionRect.top + tile.regionRect.height / 2;
                tileLeft = socket.regionRect.right + tile.regionRect.width / 2;
                break;
            case "top":
                tileTop = socket.regionRect.top - tile.regionRect.height / 2;
                tileLeft = socket.regionRect.left + tile.regionRect.width / 2;
                break;
            case "bottom":
                tileTop = socket.regionRect.bottom + tile.regionRect.height / 2;
                tileLeft = socket.regionRect.left + tile.regionRect.width / 2;
                break;
        }

        return new DOMRect(tileLeft, tileTop, 1, 1);
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

        this.setTileInSocket(this.hoverSocket);
    };

    private setTileInSocket(socket: ARSocket): void {
        if (!this.currentDragTile) {
            return;
        }
        this.currentDragTile.useVirtualAnchor = false;
        this.currentDragTile.anchorElement = socket;
        socket.childTile = this.currentDragTile;
        switch (socket.socketFacing) {
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
    }

    public handleSocketUnhovered = (e: CustomEvent): void => {
        if (e.defaultPrevented || !e.target) {
            return;
        }
        e.preventDefault();
        this.hoverSocket?.childTile = undefined;
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
        ${x => x}
    </ar-tile>
`;

const dispensorTemplate: ViewTemplate<ARTile> = html`
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
