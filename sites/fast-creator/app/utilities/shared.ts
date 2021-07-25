/**
 * These are shared configs or items between the Preview application and the Creator application
 * which are compiled separately.
 */

export const designTokensLinkedDataId: string = "design-tokens";
export const rootOriginatorId: string = "originator::root";
export const creatorOriginatorId: string = "fast-creator::root";
export const previewOriginatorId: string = "originator::preview";
export enum CustomMessageSystemActions {
    libraryAdd = "library::add",
    libraryAdded = "library::added",
}
export const displayModeMessageInteractive: string = "displayMode::interactive";
export const displayModeMessagePreview: string = "displayMode::preview";
export enum DisplayMode {
    interactive = "interactive",
    preview = "preview",
}
