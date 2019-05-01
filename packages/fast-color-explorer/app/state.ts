import { Action, createStore } from "redux";
import { ColorsDesignSystem, colorsDesignSystem } from "./design-system";
import { ColorRGBA64 } from "@microsoft/fast-colors";
import { merge } from "lodash-es";
import { createColorPalette } from "./palette";
import { Color } from "csstype";

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

function rootReducer(state: AppState, action: any): AppState {
    switch (action.type) {
        case SET_COMPONENT_TYPE:
            return Object.assign({}, state, { componentType: action.value });
        case SET_NEUTRAL_BASE_COLOR:
            const neutralDesignSystem: ColorsDesignSystem = Object.assign(
                {},
                state.designSystem
            );
            neutralDesignSystem.neutralPalette = createColorPalette(action.value);
            return Object.assign({}, state, { designSystem: neutralDesignSystem });
        case SET_ACCENT_BASE_COLOR:
            const accentDesignSystem: ColorsDesignSystem = Object.assign(
                {},
                state.designSystem
            );
            accentDesignSystem.accentPalette = createColorPalette(action.value);
            return Object.assign({}, state, { designSystem: accentDesignSystem });
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

export function setNeutralBaseColor(
    value: ColorRGBA64
): ColorExplorerAction<ColorRGBA64> {
    return { type: SET_NEUTRAL_BASE_COLOR, value };
}

export function setAccentBaseColor(value: ColorRGBA64): ColorExplorerAction<ColorRGBA64> {
    return { type: SET_ACCENT_BASE_COLOR, value };
}
