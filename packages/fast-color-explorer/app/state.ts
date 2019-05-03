import { Action, createStore } from "redux";
import { ColorsDesignSystem, colorsDesignSystem } from "./design-system";
import { ColorRGBA64 } from "@microsoft/fast-colors";
import { merge } from "lodash-es";
import { Color } from "csstype";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";

export enum ComponentTypes {
    neutral = "neutral",
    accent = "accent",
    stealth = "stealth",
    ghost = "ghost",
    text = "text",
}

/**
 * Action types
 */
const SET_COMPONENT_TYPE: symbol = Symbol();
const SET_NEUTRAL_BASE_COLOR: symbol = Symbol();
const SET_ACCENT_BASE_COLOR: symbol = Symbol();

export interface AppState {
    /**
     * The root level design system
     */
    designSystem: ColorsDesignSystem;

    /**
     * The component type being displayed
     */
    componentType: ComponentTypes;
}

export interface Action {
    type: symbol;
}

/**
 * Re-assign a palette value based on an input color reference
 */
function setPalette(
    palette: "accentPalette" | "neutralPalette"
): (state: AppState, value: ColorRGBA64) => AppState {
    return (state: AppState, value: ColorRGBA64): AppState => {
        const designSystem: ColorsDesignSystem = {
            ...state.designSystem,
            [palette]: createColorPalette(value),
        };

        return {
            ...state,
            designSystem,
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
    }

    return state;
}

export const store: any = createStore(rootReducer, {
    designSystem: colorsDesignSystem,
    componentType: ComponentTypes.neutral,
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

export const setNeutralBaseColor: ReturnType<
    typeof setColorActionCreator
> = setColorActionCreator(SET_NEUTRAL_BASE_COLOR);
export const setAccentBaseColor: ReturnType<
    typeof setColorActionCreator
> = setColorActionCreator(SET_ACCENT_BASE_COLOR);
