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
    title?: string;
    timeStamp?: string;
    score: number;
    tileData: TileData[];
    validated: boolean;
}

export interface TileData {
    title: string;
    value: number;
    fixed?: boolean;
    column?: number;
    row?: number;
    tileId?: string;
    anchorId?: string;
}
