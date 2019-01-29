import CSSEditor, { CSSPosition, CSSSpacing } from "../src";

export interface EditorComponentOptions {
    displayName: string;
    component: React.ComponentClass;
}

/**
 * Important: Update these callbacks when adding new components
 */
export const updateCallbacks: string[] = [
    "onChange",
    "onSpacingUpdate",
    "onPositionUpdate",
];

/**
 * Important: Update these components when adding new components
 */
export const editorComponents: EditorComponentOptions[] = [
    {
        displayName: "CSS Editor",
        component: CSSEditor,
    },
    {
        displayName: "CSS Position",
        component: CSSPosition,
    },
    {
        displayName: "CSS Spacing",
        component: CSSSpacing,
    },
];
