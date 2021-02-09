import { DataDictionary } from "@microsoft/fast-tooling";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { Direction } from "@microsoft/fast-web-utilities";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface EditorState {
    dataDictionary: DataDictionary<unknown>;
    viewerWidth: number;
    viewerHeight: number;
    mobileNavigationVisible: boolean;
    mobileFormVisible: boolean;
    theme: StandardLuminance;
    direction: Direction;
    transparentBackground: boolean;
    previewReady: boolean;
}
