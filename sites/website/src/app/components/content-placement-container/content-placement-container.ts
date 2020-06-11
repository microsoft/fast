import { attr, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";
import {
    FrameworkContentPlacementData,
    frameworkContentPlacementData,
} from "../../data/framework.data";
import { FeatureCardData, featureCardData } from "../../data/feature.data";
import frameworkTemplate from "./templates/framework.template";
import featureTemplate from "./templates/feature.template";
import communityTemplate from "./templates/community.template";

export class ContentPlacementContainer extends FASTElement {
    @attr section: string;

    frameworkData: FrameworkContentPlacementData[] = frameworkContentPlacementData;
    featureData: FeatureCardData[] = featureCardData;
    communityData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Medium"
    );

    dataByType = {
        framework: this.frameworkData,
        feature: this.featureData,
        community: this.communityData,
    };

    templateByType = {
        framework: frameworkTemplate,
        feature: featureTemplate,
        community: communityTemplate,
    };

    selectTemplate() {
        return this.templateByType[this.section];
    }

    selectData() {
        return this.dataByType[this.section];
    }
}
