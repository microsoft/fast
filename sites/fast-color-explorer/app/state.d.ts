import { Action } from "redux";
import { ColorRGBA64 } from "@microsoft/fast-colors";
import { Swatch } from "./recipes";
import { ColorsDesignSystem } from "./design-system";
export declare enum ComponentTypes {
    backplate = "backplate",
    text = "text",
    form = "form",
}
export interface AppState {
    /**
     * The root level design system
     */
    designSystem: ColorsDesignSystem;
    /**
     * The component type being displayed
     */
    componentType: ComponentTypes;
    /**
     * The source color that the neutral palette is derived from
     */
    neutralBaseColor: Swatch;
    /**
     * The source color that the accent palette is derived from
     */
    accentBaseColor: Swatch;
    /**
     * If the app should only display the approved background colors
     */
    showOnlyRecommendedBackgrounds: boolean;
}
export declare const store: any;
interface ColorExplorerAction<S, T = any> extends Action<T> {
    value: S;
}
/**
 * Actions
 */
export declare function setComponentType(
    value: ComponentTypes
): ColorExplorerAction<ComponentTypes>;
declare function setColorActionCreator<T>(
    type: T
): (value: ColorRGBA64) => ColorExplorerAction<ColorRGBA64, T>;
export declare function setShowOnlyRecommendedBackgrounds(
    value: boolean
): ColorExplorerAction<boolean>;
export declare const setNeutralBaseColor: ReturnType<typeof setColorActionCreator>;
export declare const setAccentBaseColor: ReturnType<typeof setColorActionCreator>;
export {};
