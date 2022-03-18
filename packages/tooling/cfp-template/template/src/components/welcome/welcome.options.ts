export const Theme = {
    dark: "dark",
    light: "light",
} as const;
export type Theme = typeof Theme[keyof typeof Theme];
