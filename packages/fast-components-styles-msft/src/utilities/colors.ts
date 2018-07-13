import Chroma from "chroma-js";

export function applyMixedColor(color1: string, color2: string, mixValue: number, alpha: number = 1): string {
    return Chroma.mix(color1, color2, mixValue).alpha(alpha).css();
}
