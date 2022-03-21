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
import { ProductData, productData } from "../../data/product.data";
import { DesignSystemData, designSystemData } from "../../data/design-system.data";
import frameworkTemplate from "./templates/framework.template";
import featureTemplate from "./templates/feature.template";
import communityTemplate from "./templates/community.template";
import productTemplate from "./templates/product.template";
import designSystemTemplate from "./templates/design-system.template";
export class ContentPlacementContainer extends FASTElement {
    @attr section: string;

    frameworkData: FrameworkContentPlacementData[] = frameworkContentPlacementData;
    featureData: FeatureCardData[] = featureCardData;
    communityData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Medium"
    );
    productData: ProductData[] = productData;
    designSystemData: DesignSystemData[] = designSystemData;

    dataByType = {
        framework: this.frameworkData,
        feature: this.featureData,
        community: this.communityData,
        product: this.productData,
        designSystem: this.designSystemData,
    };

    templateByType = {
        framework: frameworkTemplate,
        feature: featureTemplate,
        community: communityTemplate,
        product: productTemplate,
        designSystem: designSystemTemplate,
    };

    selectTemplate() {
        return this.templateByType[this.section];
    }

    selectData() {
        return this.dataByType[this.section];
    }
}
