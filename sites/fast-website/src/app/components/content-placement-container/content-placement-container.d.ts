import { FASTElement } from "@microsoft/fast-element";
import { CommunityContentPlacementData } from "../../data/community.data";
import { FrameworkContentPlacementData } from "../../data/framework.data";
import { FeatureCardData } from "../../data/feature.data";
export declare class ContentPlacementContainer extends FASTElement {
    section: string;
    frameworkData: FrameworkContentPlacementData[];
    featureData: FeatureCardData[];
    communityData: CommunityContentPlacementData[];
    dataByType: {
        framework: FrameworkContentPlacementData[];
        feature: FeatureCardData[];
        community: CommunityContentPlacementData[];
    };
    templateByType: {
        framework: import("@microsoft/fast-element").ViewTemplate<any, any>;
        feature: import("@microsoft/fast-element").ViewTemplate<any, any>;
        community: import("@microsoft/fast-element").ViewTemplate<any, any>;
    };
    selectTemplate(): any;
    selectData(): any;
}
