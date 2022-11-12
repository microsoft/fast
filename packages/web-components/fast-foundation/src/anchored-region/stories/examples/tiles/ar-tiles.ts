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

export interface GameConfig {
    rowCount?: number;
    columnCount?: number;
    tileData: TileData[];
}

export interface GameState {
    score: number;
    tileData: TileData[];
}

/**
 *
 *
 * @public
 */
export class ARTiles extends FASTElement {
    @observable
    public tileData: TileData[] = [];

    @observable
    public gameConfig: GameConfig = {
        columnCount: 14,
        rowCount: 14,
        tileData: [
            { title: "W", value: 1, column: 5, row: 6, fixed: true },
            { title: "O", value: 1, column: 6, row: 6, fixed: true },
            { title: "R", value: 1, column: 7, row: 6, fixed: true },
            { title: "D", value: 1, column: 8, row: 6, fixed: true },
            { title: "S", value: 1, column: 9, row: 6, fixed: true },
            { title: "E", value: 1 },
            { title: "A", value: 1 },
            { title: "R", value: 1 },
            { title: "I", value: 1 },
            { title: "O", value: 1 },
            { title: "T", value: 2 },
            { title: "N", value: 2 },
            { title: "S", value: 2 },
            { title: "L", value: 2 },
            { title: "C", value: 2 },
            { title: "U", value: 3 },
            { title: "D", value: 3 },
            { title: "P", value: 3 },
            { title: "M", value: 3 },
            { title: "H", value: 3 },
            { title: "G", value: 3 },
            { title: "B", value: 4 },
            { title: "F", value: 4 },
            { title: "Y", value: 4 },
            { title: "W", value: 4 },
            { title: "K", value: 4 },
            { title: "V", value: 4 },
            { title: "X", value: 5 },
            { title: "Z", value: 5 },
            { title: "J", value: 5 },
            { title: "Q", value: 5 },
            { title: "A", value: 1 },
            { title: "E", value: 1 },
            { title: "I", value: 1 },
            { title: "O", value: 1 },
            { title: "U", value: 3 },
            { title: "R", value: 1 },
        ],
    };
    public gameConfigChanged(): void {
        this.columnCount = this.gameConfig.columnCount || 14;
        this.rowCount = this.gameConfig.rowCount || 14;
        this.tileData.splice(0, this.tileData.length, ...this.gameConfig.tileData);
        this.tileData.forEach(tile => {
            if (!tile.row) {
                tile.row = undefined;
                tile.column = undefined;
            }
        });
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

    @observable
    public bestScore: number = 0;

    public layout: HTMLDivElement;
    public board: HTMLDivElement;
    public hand: HTMLDivElement;
    public verticalWordDisplay: HTMLDivElement;
    public horizontalWordDisplay: HTMLDivElement;

    @observable
    public allTiles: ARTile[] = [];
    private allTilesChanged(): void {
        if (this.$fastController.isConnected && !this.tileUpdateQueued) {
            Updates.enqueue(() => {
                this.updateTiles();
            });
            this.tileUpdateQueued = true;
        }
    }

    @observable
    public enablePrevious: boolean = false;

    @observable
    public enableNext: boolean = false;

    private previousGameStates: GameState[] = [];
    private nextGameStates: GameState[] = [];

    private allSockets: ARSocket[] = [];
    private activeSockets: ARSocket[] = [];
    private placedTiles: ARTile[] = [];
    private fixedTileData: TileData[] = [];
    private handTileData: TileData[] = [];

    private bestGameState: GameState;
    private cachedGameState: GameState | undefined;

    private activeBoardTiles: HTMLElement[] = [];

    private currentDragTile: ARTile | undefined;

    private hoverSocket: ARSocket | undefined;
    private behaviorOrchestrator: ViewBehaviorOrchestrator | null = null;

    private dispenserPlaceholder: Node | null = null;
    private tilePlaceholder: Node | null = null;
    private verticalWordPlaceholder: Node | null = null;
    private horizontalWordPlaceholder: Node | null = null;
    private boardTilePlaceholder: Node | null = null;

    private rowCount: number;
    private columnCount: number;

    private tileUpdateQueued: boolean = false;

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
        this.cachedGameState = this.getCurrentGameState();
        const detail = e.detail as tileDragEventArgs;
        this.currentDragTile = detail.tile;

        if (this.currentDragTile === undefined) {
            return;
        }
        if (this.placedTiles.includes(this.currentDragTile)) {
            this.removeTileFromSocket(this.currentDragTile);
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
                socket.virtualAnchorX =
                    detail.event.pageX - document.documentElement.scrollLeft;
                socket.virtualAnchorY =
                    detail.event.pageY - document.documentElement.scrollTop;
            });
        });
        this.currentDragTile.addEventListener(
            "positionchange",
            this.handleDragTilePositionChange
        );
        const originalSocket = this.shadowRoot?.getElementById(
            `dispenser-${this.currentDragTile.tileData.tileId}`
        );
        if (originalSocket) {
            this.currentDragTile.anchorElement = originalSocket;
        }
    };

    public handleDragTilePositionChange = (): void => {
        this.currentDragTile?.removeEventListener(
            "positionchange",
            this.handleDragTilePositionChange
        );
        Updates.enqueue(() => {
            const activeBoardTileIds: string[] = [];
            this.allSockets.forEach(socket => {
                if (this.isValidSocket(socket)) {
                    socket.socketActive = true;
                    this.activeSockets.push(socket);
                    if (socket.parentTile) {
                        const boardTile: BoardTile = this.getBoardTileForSocket(socket);
                        const boardTileId: string = `board-tile-${boardTile.row}-${boardTile.column}`;
                        if (!activeBoardTileIds.includes(boardTileId)) {
                            activeBoardTileIds.push(boardTileId);
                        }
                    }
                }
            });
            activeBoardTileIds.forEach(boardTileId => {
                const boardTile:
                    | HTMLElement
                    | null
                    | undefined = this.shadowRoot?.getElementById(boardTileId);
                if (boardTile) {
                    boardTile.classList.toggle("active", true);
                    this.activeBoardTiles.push(boardTile);
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
            if (this.cachedGameState) {
                this.previousGameStates.push(this.cachedGameState);
                this.cachedGameState = undefined;
            }
            this.nextGameStates.splice(0, this.nextGameStates.length);
            this.enableNext = false;
            this.setTileInSocket(this.hoverSocket, this.currentDragTile);
            this.enablePrevious = true;
            this.enableNext = false;
            this.nextGameStates.splice(0, this.nextGameStates.length);
        } else {
            const originalSocket = this.shadowRoot?.getElementById(
                `dispenser-${this.currentDragTile.tileData.tileId}`
            );
            if (this.cachedGameState) {
                this.cachedGameState = undefined;
            }
            this.currentDragTile.tileData.column = undefined;
            this.currentDragTile.tileData.row = undefined;
            if (originalSocket) {
                this.setTileInSocket(originalSocket as ARSocket, this.currentDragTile);
            }
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
        this.hoverSocket = undefined;

        this.activeBoardTiles.forEach(boardTile => {
            boardTile.classList.toggle("active", false);
        });
    };

    private getCurrentGameState(): GameState {
        const currentTileData: TileData[] = [];
        this.tileData.forEach(tileData => {
            currentTileData.push(
                Object.assign({ row: undefined, column: undefined }, tileData)
            );
        });
        const gameState: GameState = {
            score: this.score,
            tileData: currentTileData,
        };
        return gameState;
    }

    private isValidSocket(socket: ARSocket): boolean {
        if (
            (this.currentDragTile && this.currentDragTile.sockets.includes(socket)) ||
            !socket.parentTile ||
            !this.placedTiles.includes(socket.parentTile) ||
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
            this.currentDragTile?.regionRect
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

        if (socket.parentTile && !intersecting) {
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

    private getDropRect(
        socket: ARSocket,
        tileRect: DOMRect | undefined
    ): DOMRect | undefined {
        if (!socket.regionRect || !tileRect) {
            return undefined;
        }

        return socket.regionRect;
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
            socket.virtualAnchorX =
                detail.event.pageX - document.documentElement.scrollLeft;
            socket.virtualAnchorY =
                detail.event.pageY - document.documentElement.scrollTop;
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

    public handlePreviousClick = (e: MouseEvent): void => {
        if (this.previousGameStates.length === 0) {
            return;
        }
        const gameState: GameState | undefined = this.previousGameStates.pop();
        if (gameState) {
            this.nextGameStates.push(this.getCurrentGameState());
            this.applyGameState(gameState);
            this.enableNext = true;
            if (this.previousGameStates.length === 0) {
                this.enablePrevious = false;
            }
        }
        return;
    };

    public handleNextClick = (e: MouseEvent): void => {
        if (this.nextGameStates.length === 0) {
            return;
        }
        const gameState: GameState | undefined = this.nextGameStates.pop();
        if (gameState) {
            this.previousGameStates.push(this.getCurrentGameState());
            this.applyGameState(gameState);
            if (this.nextGameStates.length === 0) {
                this.enableNext = false;
            }
            this.enablePrevious = true;
        }
        return;
    };

    private applyGameState(gameState: GameState): void {
        for (let i = 0; i < gameState.tileData.length; i++) {
            Object.assign(this.tileData[i], gameState.tileData[i]);
        }
        this.updateTiles();
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
        this.removeTileFromSocket(this.currentDragTile);
        this.hoverSocket = undefined;
    };

    private setTileInSocket(socket: ARSocket, tile: ARTile): void {
        let anchorElement: HTMLElement | null = null;

        if (socket.parentTile) {
            const dropRect: DOMRect | undefined = this.getDropRect(
                socket,
                tile.regionRect
            );

            if (dropRect) {
                this.activeSockets.forEach(activeSocket => {
                    const activeDropRect = this.getDropRect(
                        activeSocket,
                        tile.regionRect
                    );
                    if (activeDropRect && this.isIntersecting(dropRect, activeDropRect)) {
                        this.connectTileToSocket(activeSocket, tile);
                    }
                });
            }

            const boardTile: BoardTile = this.getBoardTileForSocket(socket);

            tile.tileData.row = boardTile.row;
            tile.tileData.column = boardTile.column;

            if (this.shadowRoot) {
                anchorElement = this.shadowRoot.getElementById(
                    `board-tile-${boardTile.row}-${boardTile.column}`
                );
            }
        }

        tile.anchorElement = anchorElement || socket;
        tile.useVirtualAnchor = false;
        tile.horizontalDefaultPosition = "center";
        tile.verticalDefaultPosition = "center";

        if (!this.placedTiles.includes(tile) && !this.hand.contains(socket)) {
            this.placedTiles.push(tile);
        }
        this.updateScore();
        Updates.enqueue(() => tile.update());
    }

    private getBoardTileForSocket(socket: ARSocket): BoardTile {
        let row: number = socket.parentTile?.tileData.row || 0;
        let column: number = socket.parentTile?.tileData.column || 0;

        switch (socket.socketFacing) {
            case "left":
                column = column - 1;
                break;
            case "right":
                column = column + 1;
                break;
            case "top":
                row = row - 1;
                break;
            case "bottom":
                row = row + 1;
                break;
        }

        return { row, column };
    }

    private removeTileFromSocket(tile: ARTile): void {
        const originalSocket = this.shadowRoot?.getElementById(
            `dispenser-${tile.tileData.tileId}`
        );
        if (originalSocket) {
            tile.anchorElement = originalSocket;
        }

        tile.sockets.forEach(dragTileSocket => {
            if (dragTileSocket.connectedTile) {
                dragTileSocket.connectedTile.sockets.forEach(childTileSocket => {
                    if (childTileSocket.connectedTile === tile) {
                        childTileSocket.connectedTile = undefined;
                    }
                });
                const tileToCheck: ARTile = dragTileSocket.connectedTile;
                dragTileSocket.connectedTile = undefined;
                if (!this.isConnectedToFixedTile(tileToCheck, [])) {
                    this.removeTileFromSocket(tileToCheck);
                }
            }
        });
        if (this.placedTiles.includes(tile)) {
            this.placedTiles.splice(this.placedTiles.indexOf(tile), 1);
        }

        this.updateScore();
    }

    private isConnectedToFixedTile(tile: ARTile, checkedTiles: ARTile[]): boolean {
        if (checkedTiles.includes(tile)) {
            return false;
        }
        checkedTiles.push(tile);
        for (let i = 0; i < tile.sockets.length; i++) {
            const connectedTile = tile.sockets[i].connectedTile;
            if (
                connectedTile &&
                (connectedTile.tileData.fixed ||
                    this.isConnectedToFixedTile(connectedTile, checkedTiles))
            ) {
                return true;
            }
        }

        return false;
    }

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
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
        }
    }

    private reset(): void {
        this.score = 0;
        this.allSockets.splice(0, this.allSockets.length);
        this.activeSockets.splice(0, this.activeSockets.length);
        this.placedTiles.splice(0, this.placedTiles.length);
        this.fixedTileData.splice(0, this.fixedTileData.length);
        this.handTileData.splice(0, this.handTileData.length);
        this.boardSpaces.splice(0, this.boardSpaces.length);
        this.currentDragTile = undefined;
        this.hoverSocket = undefined;

        for (let row = 1; row <= this.rowCount; row++) {
            for (let column = 1; column <= this.columnCount; column++) {
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
    }

    private updateTiles(): void {
        this.tileUpdateQueued = false;
        this.placedTiles.splice(0, this.placedTiles.length);
        let anchorElement: Element | null | undefined = null;
        this.allTiles.forEach(tile => {
            if (tile.tileData.row && tile.tileData.column) {
                anchorElement = this.shadowRoot?.getElementById(
                    `board-tile-${tile.tileData.row}-${tile.tileData.column}`
                );
                this.placedTiles.push(tile);
            } else {
                anchorElement = this.shadowRoot?.getElementById(
                    `dispenser-${tile.tileData.tileId}`
                );
            }
            if (anchorElement !== undefined && anchorElement !== tile.anchorElement) {
                tile.anchorElement = anchorElement;
            }
            tile.sockets.forEach(socket => {
                socket.connectedTile = undefined;
            });
            anchorElement = null;
        });

        this.placedTiles.forEach(tile => {
            for (let i = 0; i < this.placedTiles.length; i++) {
                const compareTile = this.placedTiles[i];
                if (
                    compareTile !== tile &&
                    compareTile.tileData.row &&
                    compareTile.tileData.column
                ) {
                    if (
                        tile.tileData.row === compareTile.tileData.row &&
                        tile.tileData.column === compareTile.tileData.column - 1
                    ) {
                        this.connectTileToSocket(tile.socketRight, compareTile);
                    } else if (
                        tile.tileData.column === compareTile.tileData.column &&
                        tile.tileData.row === compareTile.tileData.row - 1
                    ) {
                        this.connectTileToSocket(tile.socketBottom, compareTile);
                    }
                }
            }
        });

        this.updateScore();
    }

    private connectTileToSocket(socket: ARSocket, tile: ARTile): void {
        socket.connectedTile = tile;
        switch (socket.socketFacing) {
            case "left":
                tile.socketRight.connectedTile = socket.parentTile;
                break;
            case "right":
                tile.socketLeft.connectedTile = socket.parentTile;
                break;
            case "top":
                tile.socketBottom.connectedTile = socket.parentTile;
                break;
            case "bottom":
                tile.socketTop.connectedTile = socket.parentTile;
                break;
        }
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
    <fast-option class="score-word-option">
        <div class="score-word-display">
            <div class="score-word-word">
                ${x => x.word}
            </div>
            <div class="score-word-score">
                ${x => x.value}
            </div>
        </div>
    </fast-option>
`;

const letterTileTemplate: ViewTemplate<TileData> = html`
    <ar-tile
        :tileData="${x => x}"
        id="${x => x.tileId}"
        viewport="layout"
        vertical-viewport-lock="true"
        horizontal-viewport-lock="true"
    ></ar-tile>
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
                    <h2>
                        ScoreWords
                    </h2>
                    Score: ${x => x.score}
                    <br></br>
                    Best Score: ${x => x.bestScore}
                    <br></br>
                    <fast-button
                        disabled="${x => (x.enablePrevious ? void 0 : "true")}"
                        @click="${(x, c) => x.handlePreviousClick(c.event as MouseEvent)}"
                    >
                    Previous
                    </fast-button>
                    <fast-button
                        disabled="${x => (x.enableNext ? void 0 : "true")}"
                        @click="${(x, c) => x.handleNextClick(c.event as MouseEvent)}"
                    >
                    Next
                    </fast-button>
                    <h3>
                        Vertical Words
                    </h3>

                    <fast-listbox
                        ${ref("verticalWordDisplay")}
                        class="score-word-listbox"
                    >
                    </fast-listbox>

                    <h3>
                        Horizontal Words
                    </h3>

                    <fast-listbox
                        ${ref("horizontalWordDisplay")}
                        class="score-word-listbox"
                    >
                    </fast-listbox>
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
        grid-template-columns: 10px 560px 10px 200px 10px;
        grid-template-rows: 10px 560px 10px auto 10px;
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
        grid-column: 2;
        background: lightgray;
        display: flex;
        gap; 10px;
        flex-wrap: wrap;
    }

    .scoring {
        padding: 10px;
        background: darkgray;
        grid-row: 2 / 5;
        grid-column: 4;
    }

    .board-tile {
        border: solid 2px;
    }

    .board-tile.active {
        background: white;
    }

    .score-word-listbox {
        width: 100%;
        min-height: 50px;
    }

    .score-word-option {
        width: 100%;
    }

    .score-word-option::part(content){
        width: 100%;
    }

    .score-word-display {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
    }

    .score-word-word {
        grid-column: 1;
        grid-row: 1;

    }

    .score-word-score {
        background: green;
        grid-column: 2;
        grid-row: 1;
    }
`;
