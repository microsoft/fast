import { createStore } from "redux";
import { PaletteRGB } from "@microsoft/fast-components";
import { colorsDesignSystem, swatchToSwatchRGB } from "./design-system";
import { defaultNeutralColor } from "./colors";
export var ComponentTypes;
(function (ComponentTypes) {
    ComponentTypes["backplate"] = "backplate";
    ComponentTypes["text"] = "text";
    ComponentTypes["form"] = "form";
})(ComponentTypes || (ComponentTypes = {}));
/**
 * Action types
 */
const SET_COMPONENT_TYPE = Symbol();
const SET_NEUTRAL_BASE_COLOR = Symbol();
const SET_ACCENT_BASE_COLOR = Symbol();
const SET_SHOW_ONLY_APPROVED_BACKGROUNDS = Symbol();
/**
 * Re-assign a palette value based on an input color reference
 */
function setPalette(palette) {
    const paletteState = palette + "Palette";
    const paletteStateRGB = palette + "PaletteRGB";
    const baseColor = palette + "BaseColor";
    return (state, value) => {
        const pRGB = PaletteRGB.create(swatchToSwatchRGB(value.toStringHexRGB()));
        const designSystem = Object.assign(Object.assign({}, state.designSystem), {
            [paletteState]: pRGB.swatches.map(x => x.toColorString()),
            [paletteStateRGB]: pRGB,
        });
        if (palette === "accent") {
            designSystem.accentBaseColor = value.toStringHexRGB();
        }
        return Object.assign(Object.assign({}, state), {
            designSystem,
            [baseColor]: value.toStringHexRGB(),
        });
    };
}
const setAccentPalette = setPalette("accent");
const setNeutralPalette = setPalette("neutral");
function rootReducer(state, action) {
    switch (action.type) {
        case SET_COMPONENT_TYPE:
            return Object.assign({}, state, { componentType: action.value });
        case SET_NEUTRAL_BASE_COLOR:
            return setNeutralPalette(state, action.value);
        case SET_ACCENT_BASE_COLOR:
            return setAccentPalette(state, action.value);
        case SET_SHOW_ONLY_APPROVED_BACKGROUNDS:
            return Object.assign(Object.assign({}, state), {
                showOnlyRecommendedBackgrounds: action.value,
            });
    }
    return state;
}
export const store = createStore(rootReducer, {
    designSystem: colorsDesignSystem,
    componentType: ComponentTypes.backplate,
    neutralBaseColor: defaultNeutralColor,
    accentBaseColor: colorsDesignSystem.accentBaseColor,
    showOnlyRecommendedBackgrounds: true,
});
/**
 * Actions
 */
export function setComponentType(value) {
    return { type: SET_COMPONENT_TYPE, value };
}
function setColorActionCreator(type) {
    return value => {
        return { type, value };
    };
}
export function setShowOnlyRecommendedBackgrounds(value) {
    return { type: SET_SHOW_ONLY_APPROVED_BACKGROUNDS, value };
}
export const setNeutralBaseColor = setColorActionCreator(SET_NEUTRAL_BASE_COLOR);
export const setAccentBaseColor = setColorActionCreator(SET_ACCENT_BASE_COLOR);
