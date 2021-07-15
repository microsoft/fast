var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { customElement } from "@microsoft/fast-element";
import { FastFrame } from "./fast-frame";
import { FastFrameTemplate as template } from "./fast-frame.template";
import { FastFrameStyles as styles } from "./fast-frame.styles";
let FASTFastFrame = class FASTFastFrame extends FastFrame {};
FASTFastFrame = __decorate(
    [
        customElement({
            name: "fast-frame",
            template,
            styles,
        }),
    ],
    FASTFastFrame
);
export { FASTFastFrame };
export * from "./fast-frame.template";
export * from "./fast-frame.styles";
export * from "./fast-frame";
