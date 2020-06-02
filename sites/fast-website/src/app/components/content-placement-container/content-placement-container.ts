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

export class ContentPlacementContainer extends FASTElement {
    @attr section: string;

    communityContentPlacementData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Medium"
    );
    frameworkContentPlacementData: FrameworkContentPlacementData[] = frameworkContentPlacementData;
    featureCardData: FeatureCardData[] = featureCardData;
}
