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
import { SectionHeader } from "./section-header";
import { SectionHeaderTemplate as template } from "./section-header.template";
import { SectionHeaderStyles as styles } from "./section-header.styles";
let SiteSectionHeader = class SiteSectionHeader extends SectionHeader {};
SiteSectionHeader = __decorate(
    [
        customElement({
            name: "site-section-header",
            template,
            styles,
        }),
    ],
    SiteSectionHeader
);
export { SiteSectionHeader };
export * from "./section-header.template";
export * from "./section-header.styles";
export * from "./section-header";
