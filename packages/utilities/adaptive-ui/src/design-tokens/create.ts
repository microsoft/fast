import { DesignToken } from "@microsoft/fast-foundation";

/** @internal */
export const { create } = DesignToken;

/** @internal */
export function createNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name });
}
