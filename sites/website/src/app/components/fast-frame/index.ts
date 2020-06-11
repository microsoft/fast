import { customElement } from "@microsoft/fast-element";
import { FastFrame } from "./fast-frame";
import { FastFrameTemplate as template } from "./fast-frame.template";
import { FastFrameStyles as styles } from "./fast-frame.styles";

@customElement({
    name: "fast-frame",
    template,
    styles,
})
export class FASTFastFrame extends FastFrame {}
export * from "./fast-frame.template";
export * from "./fast-frame.styles";
export * from "./fast-frame";
