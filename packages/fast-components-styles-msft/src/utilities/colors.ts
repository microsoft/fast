import Chroma from "chroma-js";
import withDesignSystemDefaults, { IDesignSystem } from "../design-system";

export function applyMixedColor(color1: string, color2: string, mixValue: number, alpha: number = 1): string {
    return Chroma.mix(color1, color2, mixValue).alpha(alpha).css();
}

export enum ContrastModifiers {
    rest = 0,
    hover = 1,
    disabled = 3
};
