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
import { attr, FASTElement } from "@microsoft/fast-element";
import { communityContentPlacementData } from "../../data/community.data";
import { frameworkContentPlacementData } from "../../data/framework.data";
import { featureCardData } from "../../data/feature.data";
import frameworkTemplate from "./templates/framework.template";
import featureTemplate from "./templates/feature.template";
import communityTemplate from "./templates/community.template";
export class ContentPlacementContainer extends FASTElement {
    constructor() {
        super(...arguments);
        this.frameworkData = frameworkContentPlacementData;
        this.featureData = featureCardData;
        this.communityData = communityContentPlacementData.filter(
            x => x.header !== "Medium"
        );
        this.dataByType = {
            framework: this.frameworkData,
            feature: this.featureData,
            community: this.communityData,
        };
        this.templateByType = {
            framework: frameworkTemplate,
            feature: featureTemplate,
            community: communityTemplate,
        };
    }
    selectTemplate() {
        return this.templateByType[this.section];
    }
    selectData() {
        return this.dataByType[this.section];
    }
}
__decorate([attr], ContentPlacementContainer.prototype, "section", void 0);
