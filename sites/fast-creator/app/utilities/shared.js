/**
 * These are shared configs or items between the Preview application and the Creator application
 * which are compiled separately.
 */
export const designTokensLinkedDataId = "design-tokens";
export const rootOriginatorId = "originator::root";
export const creatorOriginatorId = "fast-creator::root";
export const previewOriginatorId = "originator::preview";
export var CustomMessageSystemActions;
(function (CustomMessageSystemActions) {
    CustomMessageSystemActions["libraryAdd"] = "library::add";
    CustomMessageSystemActions["libraryAdded"] = "library::added";
})(CustomMessageSystemActions || (CustomMessageSystemActions = {}));
export const displayModeMessageInteractive = "displayMode::interactive";
export const displayModeMessagePreview = "displayMode::preview";
export var DisplayMode;
(function (DisplayMode) {
    DisplayMode["interactive"] = "interactive";
    DisplayMode["preview"] = "preview";
})(DisplayMode || (DisplayMode = {}));
