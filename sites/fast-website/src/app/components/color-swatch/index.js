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
import { ColorSwatch } from "./color-swatch";
import { ColorSwatchTemplate as template } from "./color-swatch.template";
import { ColorSwatchStyles as styles } from "./color-swatch.styles";
let SiteColorSwatch = class SiteColorSwatch extends ColorSwatch {};
SiteColorSwatch = __decorate(
    [
        customElement({
            name: "site-color-swatch",
            template,
            styles,
        }),
    ],
    SiteColorSwatch
);
export { SiteColorSwatch };
export * from "./color-swatch.template";
export * from "./color-swatch.styles";
export * from "./color-swatch";
