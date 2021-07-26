import { DataDictionary, SchemaDictionary } from "@microsoft/fast-tooling";
import { StandardLuminance } from "@microsoft/fast-components";
import { Direction } from "@microsoft/fast-web-utilities";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface EditorState {
    schemaDictionary: SchemaDictionary;
    dataDictionary: DataDictionary<unknown>;
    viewerWidth: number;
    viewerHeight: number;
    mobileNavigationVisible: boolean;
    mobileFormVisible: boolean;
    theme: StandardLuminance;
    direction: Direction;
    transparentBackground: boolean;
    previewReady: boolean;

    /**
     * The last value that was changed from the data dictionary to
     * a value used by monaco editor.
     *
     * This can be used to determine where a change comes from since
     * any update to the monaco editors value is treated the same (making a change
     * from within the editor vs setting the value externally)
     */
    lastMappedDataDictionaryToMonacoEditorHTMLValue: string;
}
