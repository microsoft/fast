import { Action, createStore } from "redux";
import { ColorRGBA64 } from "@microsoft/fast-colors";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { Swatch } from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";
import { ColorsDesignSystem, colorsDesignSystem } from "./design-system";
import { defaultNeutralColor } from "./colors";

export enum ComponentTypes {
    backplate = "backplate",
    text = "text",
    form = "form",
}

/**
 * Action types
 */
const SET_COMPONENT_TYPE: symbol = Symbol();
const SET_NEUTRAL_BASE_COLOR: symbol = Symbol();
const SET_ACCENT_BASE_COLOR: symbol = Symbol();
const SET_SHOW_ONLY_APPROVED_BACKGROUNDS: symbol = Symbol();

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

/**
 * Re-assign a palette value based on an input color reference
 */
function setPalette(
    palette: "accentPalette" | "neutralPalette"
): (state: AppState, value: ColorRGBA64) => AppState {
    const baseColor: string =
        palette === "accentPalette" ? "accentBaseColor" : "neutralBaseColor";
    return (state: AppState, value: ColorRGBA64): AppState => {
        const designSystem: ColorsDesignSystem = {
            ...state.designSystem,
            [palette]: createColorPalette(value),
        };
        if (palette === "accentPalette") {
            designSystem.accentBaseColor = value.toStringHexRGB();
        }

        return {
            ...state,
            designSystem,
            [baseColor]: value.toStringHexRGB(),
        };
    };
}

const setAccentPalette: ReturnType<typeof setPalette> = setPalette("accentPalette");
const setNeutralPalette: ReturnType<typeof setPalette> = setPalette("neutralPalette");

function rootReducer(state: AppState, action: any): AppState {
    switch (action.type) {
        case SET_COMPONENT_TYPE:
            return Object.assign({}, state, { componentType: action.value });
        case SET_NEUTRAL_BASE_COLOR:
            return setNeutralPalette(state, action.value);
        case SET_ACCENT_BASE_COLOR:
            return setAccentPalette(state, action.value);
        case SET_SHOW_ONLY_APPROVED_BACKGROUNDS:
            return { ...state, ...{ showOnlyRecommendedBackgrounds: action.value } };
    }

    return state;
}

export const store: any = createStore(rootReducer, {
    designSystem: colorsDesignSystem,
    componentType: ComponentTypes.backplate,
    neutralBaseColor: defaultNeutralColor,
    accentBaseColor: colorsDesignSystem.accentBaseColor,
    showOnlyRecommendedBackgrounds: true,
});

interface ColorExplorerAction<S, T = any> extends Action<T> {
    value: S;
}

/**
 * Actions
 */
export function setComponentType(
    value: ComponentTypes
): ColorExplorerAction<ComponentTypes> {
    return { type: SET_COMPONENT_TYPE, value };
}

function setColorActionCreator<T>(
    type: T
): (value: ColorRGBA64) => ColorExplorerAction<ColorRGBA64, T> {
    return (value: ColorRGBA64): ColorExplorerAction<ColorRGBA64, T> => {
        return { type, value };
    };
}

export function setShowOnlyRecommendedBackgrounds(
    value: boolean
): ColorExplorerAction<boolean> {
    return { type: SET_SHOW_ONLY_APPROVED_BACKGROUNDS, value };
}

export const setNeutralBaseColor: ReturnType<typeof setColorActionCreator> = setColorActionCreator(
    SET_NEUTRAL_BASE_COLOR
);
export const setAccentBaseColor: ReturnType<typeof setColorActionCreator> = setColorActionCreator(
    SET_ACCENT_BASE_COLOR
);
