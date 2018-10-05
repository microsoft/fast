import * as CSS from "csstype";

export interface ScreenReaderOnly {
    position: CSS.PositionProperty;
    overflow: CSS.OverflowProperty;
    clip: CSS.ClipProperty;
    width: CSS.WidthProperty<string>;
    height: CSS.HeightProperty<string>;
    border: CSS.BorderProperty<string>;
    padding: CSS.PaddingProperty<string>;
    margin: CSS.MarginProperty<string>;
}

export function applyScreenReader(): ScreenReaderOnly {
    return {
        position: "absolute",
        overflow: "hidden",
        clip: "rect(1px, 1px, 1px, 1px)",
        width: "1px",
        height: "1px",
        border: "0",
        padding: "0",
        margin: "0"
    };
}
