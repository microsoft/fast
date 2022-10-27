import {
    bind,
    children,
    css,
    elements,
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
import { Orientation } from "@microsoft/fast-web-utilities";
import { ARTile, registerARTile, TileData, tileDragEventArgs } from "./ar-tile.js";
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

export interface ScoreWord {
    word: string;
    tiles: ARTile[];
    value: number;
    orientation: Orientation;
}

export interface BoardTile {
    row: number;
    column: number;
}

/**
 *
 *
 * @public
 */
export class ARTiles extends FASTElement {
    @observable
    public tileData: TileData[] = [
        { title: "A", value: 1, column: 5, row: 5, fixed: true },
        { title: "B", value: 1, column: 6, row: 5, fixed: true },
        { title: "C", value: 1, column: 7, row: 5, fixed: true },
        { title: "D", value: 1, column: 5, row: 4, fixed: true },
        { title: "E", value: 1, column: 5, row: 6, fixed: true },
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

    public tilesChanged(): void {
        if (this.$fastController.isConnected) {
            this.reset();
        }
    }

    @observable
    public boardSpaces: BoardTile[] = [];

    @observable
    public horizontalWords: ScoreWord[] = [];

    @observable
    public verticalWords: ScoreWord[] = [];

    @observable
    public score: number = 0;

    public layout: HTMLDivElement;
    public board: HTMLDivElement;
    public hand: HTMLDivElement;
    public verticalWordDisplay: HTMLDivElement;
    public horizontalWordDisplay: HTMLDivElement;

    public allTiles: ARTile[] = [];

    private allSockets: ARSocket[] = [];
    private activeSockets: ARSocket[] = [];
    private placedTiles: ARTile[] = [];
    private fixedTileData: TileData[] = [];
    private handTileData: TileData[] = [];

    private currentDragTile: ARTile | undefined;
    private dragTileOriginalSocket: ARSocket | undefined;

    private hoverSocket: ARSocket | undefined;
    private behaviorOrchestrator: ViewBehaviorOrchestrator | null = null;

    private dispenserPlaceholder: Node | null = null;
    private tilePlaceholder: Node | null = null;
    private verticalWordPlaceholder: Node | null = null;
    private horizontalWordPlaceholder: Node | null = null;
    private boardTilePlaceholder: Node | null = null;

    private boardRows: number = 15;
    private boardColumns: number = 15;

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("socketconnected", this.handleSocketConnected);
        this.addEventListener("socketdisconnected", this.handleSocketDisconnected);
        this.addEventListener("dragtilestart", this.handleDragTileStart);
        this.addEventListener("dragtileend", this.handleDragTileEnd);

        this.dispenserPlaceholder = document.createComment("");
        this.tilePlaceholder = document.createComment("");
        this.verticalWordPlaceholder = document.createComment("");
        this.horizontalWordPlaceholder = document.createComment("");
        this.boardTilePlaceholder = document.createComment("");

        if (this.behaviorOrchestrator === null) {
            this.behaviorOrchestrator = ViewBehaviorOrchestrator.create(this);

            this.$fastController.addBehavior(this.behaviorOrchestrator);
            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.handTileData, false),
                    bind(x => dispenserTemplate, false),
                    { positioning: true }
                ),
                this.hand.appendChild(this.dispenserPlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.handTileData, false),
                    bind(x => letterTileTemplate, false),
                    { positioning: true }
                ),
                this.layout.appendChild(this.tilePlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.fixedTileData, false),
                    bind(x => letterTileTemplate, false),
                    { positioning: true }
                ),
                this.layout.appendChild(this.tilePlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.verticalWords, false),
                    bind(x => scoreWordTemplate, false),
                    { positioning: true }
                ),
                this.verticalWordDisplay.appendChild(this.verticalWordPlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.horizontalWords, false),
                    bind(x => scoreWordTemplate, false),
                    { positioning: true }
                ),
                this.horizontalWordDisplay.appendChild(this.horizontalWordPlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ARTiles>(
                    bind(x => x.boardSpaces, false),
                    bind(x => boardTileTemplate, false),
                    { positioning: true }
                ),
                this.board.appendChild(this.boardTilePlaceholder)
            );

            this.reset();
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
        //tile.fixed = true;
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
        if (socket.parentTile && dropRect) {
            this.activeSockets.forEach(activeSocket => {
                const activeDropRect = this.getDropRect(activeSocket, tile);
                if (activeDropRect && this.isIntersecting(dropRect, activeDropRect)) {
                    activeSocket.connectedTile = tile;
                    switch (activeSocket.socketFacing) {
                        case "left":
                            tile.socketRight.connectedTile = activeSocket.parentTile;
                            break;
                        case "right":
                            tile.socketLeft.connectedTile = activeSocket.parentTile;
                            break;
                        case "top":
                            tile.socketBottom.connectedTile = activeSocket.parentTile;
                            break;
                        case "bottom":
                            tile.socketTop.connectedTile = activeSocket.parentTile;
                            break;
                    }
                }
            });
        }
        tile.anchorElement = socket;
        tile.useVirtualAnchor = false;
        if (!this.placedTiles.includes(tile) && !this.hand.contains(socket)) {
            this.placedTiles.push(tile);
        }
        this.updateScore();
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
        if (this.placedTiles.includes(tile)) {
            this.placedTiles.splice(this.placedTiles.indexOf(tile), 1);
        }

        this.updateScore();
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
        this.currentDragTile.useVirtualAnchor = true;
        this.currentDragTile.horizontalDefaultPosition = "right";
        this.currentDragTile.verticalDefaultPosition = "bottom";
        if (this.dragTileOriginalSocket) {
            this.currentDragTile.anchorElement = this.dragTileOriginalSocket;
        }
        this.removeTileFromSocket(this.hoverSocket, this.currentDragTile);
        this.hoverSocket = undefined;
    };

    private updateScore(): void {
        let newScore: number = 0;
        this.horizontalWords.splice(0, this.horizontalWords.length);
        this.verticalWords.splice(0, this.verticalWords.length);

        let wordTiles: ARTile[];
        let wordString: string;
        let currentTile: ARTile;
        let wordValue: number;

        this.placedTiles.forEach(tile => {
            if (!tile.socketLeft.connectedTile && tile.socketRight.connectedTile) {
                wordTiles = [tile];
                wordString = tile.tileData.title;
                currentTile = tile;
                wordValue = tile.tileData.value;
                while (currentTile.socketRight.connectedTile) {
                    wordTiles.push(currentTile.socketRight.connectedTile);
                    currentTile = currentTile.socketRight.connectedTile;
                    wordString = `${wordString}${currentTile.tileData.title}`;
                    wordValue = wordValue + currentTile.tileData.value;
                }
                wordValue = wordValue * wordTiles.length;
                const scoreWord: ScoreWord = {
                    word: wordString,
                    tiles: wordTiles,
                    value: wordValue,
                    orientation: Orientation.horizontal,
                };
                this.horizontalWords.push(scoreWord);
                newScore = newScore + wordValue;
            }

            if (!tile.socketTop.connectedTile && tile.socketBottom.connectedTile) {
                wordTiles = [tile];
                wordString = tile.tileData.title;
                currentTile = tile;
                wordValue = tile.tileData.value;
                while (currentTile.socketBottom.connectedTile) {
                    wordTiles.push(currentTile.socketBottom.connectedTile);
                    currentTile = currentTile.socketBottom.connectedTile;
                    wordString = `${wordString}${currentTile.tileData.title}`;
                    wordValue = wordValue + currentTile.tileData.value;
                }
                wordValue = wordValue * wordTiles.length;
                const scoreWord: ScoreWord = {
                    word: wordString,
                    tiles: wordTiles,
                    value: wordValue,
                    orientation: Orientation.vertical,
                };
                this.verticalWords.push(scoreWord);
                newScore = newScore + wordValue;
            }
        });
        this.score = newScore;
    }

    private reset(): void {
        this.score = 0;
        this.allSockets.splice(0, this.allSockets.length);
        this.activeSockets.splice(0, this.activeSockets.length);
        this.placedTiles.splice(0, this.placedTiles.length);
        this.fixedTileData.splice(0, this.fixedTileData.length);
        this.boardSpaces.splice(0, this.boardSpaces.length);
        this.currentDragTile = undefined;
        this.dragTileOriginalSocket = undefined;
        this.hoverSocket = undefined;

        for (let row = 1; row <= this.boardRows; row++) {
            for (let column = 1; column <= this.boardColumns; column++) {
                this.boardSpaces.push({
                    row,
                    column,
                });
            }
        }

        this.tileData.forEach(thisTileData => {
            thisTileData.tileId = `tile-${this.tileData.indexOf(thisTileData)}`;
            if (thisTileData.fixed) {
                this.fixedTileData.push(thisTileData);
            } else {
                this.handTileData.push(thisTileData);
            }
        });

        Updates.enqueue(this.updateTiles);
    }

    private updateTiles = (): void => {
        this.placedTiles.splice(0, this.placedTiles.length);
        this.allTiles.forEach(tile => {
            if (tile.tileData.row && tile.tileData.column) {
                this.placedTiles.push(tile);
            }
        });
        this.updateTileConnections();
        this.updateScore();
    };

    private updateTileConnections(): void {
        this.placedTiles.forEach(tile => {});
    }
}

const sectionDividerTemplate = html`
    <fast-divider style="margin:20px;"></fast-divider>
`;

const boardTileTemplate: ViewTemplate<BoardTile> = html`
    <div
        id="board-tile-${x => x.row}-${x => x.column}"
        class="board-tile"
        style="grid-column:${x => x.column}; grid-row:${x => x.row}"
    ></div>
`;

const scoreWordTemplate: ViewTemplate<ScoreWord> = html`
    <div>
        ${x => x.word} -> ${x => x.value}
    </div>
`;

const letterTileTemplate: ViewTemplate<TileData> = html`
    <ar-tile
        :tileData="${x => x}"
        id="${x => x.tileId}"
        anchor="${x =>
            x.row && x.column
                ? `board-tile-${x.row}-${x.column}`
                : `dispenser-${x.tileId}`}"
        viewport="layout"
        vertical-viewport-lock="true"
        horizontal-viewport-lock="true"
    >
        ${x => x.title}
    </ar-tile>
`;

const dispenserTemplate: ViewTemplate<TileData> = html`
    <ar-socket
        id="dispenser-${x => x.tileId}"
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
            <div
                id="layout"
                class="layout"
                ${children({
                    property: "allTiles",
                    filter: elements("ar-tile"),
                })}
                ${ref("layout")}
            >
                <div id="board" class="board" ${ref("board")}></div>
                <div id="hand" class="hand" ${ref("hand")}></div>
                <div class="scoring">
                    Score: ${x => x.score}
                    <p>
                        Vertical words:
                    </p>

                    <div ${ref("verticalWordDisplay")}></div>
                    <p>
                        Horizontal Words
                    </p>

                    <div ${ref("horizontalWordDisplay")}></div>
                </div>
            </div>
        </template>
    `;
}

export const arTilesStyles = css`
    :host {
    }

    .start {
        grid-row: 5;
        grid-column: 5;
        background: yellow;
        height: 40px;
        width: 40px;
    }

    .dispenser {
        margin: 5px;
        background: brown;
        height: 40px;
        width: 40px;
    }

    .layout {
        height: auto;
        width: 1000px;
        position: relative;
        display: grid;
        grid-template-columns: 10px 600px 10px 200px 10px;
        grid-template-rows: 10px 600px 10px auto 10px;
    }

    .board {
        grid-row: 2;
        grid-column: 2;
        background: lightgray;
        display: grid;
        grid-template-columns: repeat(15, 40px);
        grid-template-rows: repeat(15, 40px);
    }

    .hand {
        position: relative;
        grid-row: 4;
        grid-column: 2 / 5;
        background: lightgray;
        display: flex;
        gap; 10px;
        flex-wrap: wrap;
    }

    .scoring {
        padding: 10px;
        background: darkgray;
        grid-row: 2;
        grid-column: 4;
    }

    .board-tile {
        border: solid 2px;
    }
`;
