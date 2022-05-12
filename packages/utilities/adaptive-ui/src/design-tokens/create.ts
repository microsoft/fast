import { DesignToken } from "@microsoft/fast-foundation";

export const { create } = DesignToken;

export function createNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name, cssCustomPropertyName: null });
}
