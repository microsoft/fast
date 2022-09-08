import { DesignToken } from "@microsoft/fast-foundation";

export const fontFamily = DesignToken.create<string>("font-family").withDefault(
    "Segoe UI, Arial, sans-serif"
);
export const neutralForeground = DesignToken.create<string>(
    "neutral-foreground"
).withDefault("#2B2B2B");
