import { Action, createStore } from "redux";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    accentColor,
    neutralColor,
    PaletteRGB,
    Swatch,
    SwatchRGB,
} from "@microsoft/fast-components";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

export enum ComponentTypes {
    backplate = "backplate",
    text = "text",
    form = "form",
    sample = "sample",
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
     * The component type being displayed
     */
    componentType: ComponentTypes;

    /**
     * The source color that the neutral palette is derived from
     */
    neutralBaseColor: string;

    neutralPalette: string[];

    /**
     * The source color that the accent palette is derived from
     */
    accentBaseColor: string;

    accentPalette: string[];

    /**
     * If the app should only display the approved background colors
     */
    showOnlyRecommendedBackgrounds: boolean;
}

/**
 * Re-assign a palette value based on an input color reference
 */
function setPalette(
    palette: "accent" | "neutral"
): (state: AppState, value: ColorRGBA64) => AppState {
    const paletteState: string = palette + "Palette";
    const baseColor: string = palette + "BaseColor";
    return (state: AppState, value: ColorRGBA64): AppState => {
        const swatch: Swatch = SwatchRGB.from(parseColorHexRGB(value.toStringHexRGB()));
        const pRGB: PaletteRGB = PaletteRGB.from(swatch as SwatchRGB);

        if (palette === "accent") {
            accentColor.setValueFor(document.body, swatch);
        } else {
            neutralColor.setValueFor(document.body, swatch);
        }

        return {
            ...state,
            [baseColor]: value.toStringHexRGB(),
            [paletteState]: pRGB.swatches.map((x: SwatchRGB) => x.toColorString()),
        };
    };
}

const setAccentPalette: ReturnType<typeof setPalette> = setPalette("accent");
const setNeutralPalette: ReturnType<typeof setPalette> = setPalette("neutral");

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
    componentType: ComponentTypes.backplate,
    neutralBaseColor: defaultNeutralColor,
    neutralPalette: PaletteRGB.from(
        SwatchRGB.from(parseColorHexRGB(defaultNeutralColor)!)
    ).swatches.map((x: SwatchRGB) => x.toColorString()),
    accentBaseColor: defaultAccentColor,
    accentPalette: PaletteRGB.from(
        SwatchRGB.from(parseColorHexRGB(defaultAccentColor)!)
    ).swatches.map((x: SwatchRGB) => x.toColorString()),
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
