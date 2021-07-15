/**
 * These are shared configs or items between the Preview application and the Creator application
 * which are compiled separately.
 */
export declare const designTokensLinkedDataId: string;
export declare const rootOriginatorId: string;
export declare const creatorOriginatorId: string;
export declare const previewOriginatorId: string;
export declare enum CustomMessageSystemActions {
    libraryAdd = "library::add",
    libraryAdded = "library::added",
}
export declare const displayModeMessageInteractive: string;
export declare const displayModeMessagePreview: string;
export declare enum DisplayMode {
    interactive = "interactive",
    preview = "preview",
}
