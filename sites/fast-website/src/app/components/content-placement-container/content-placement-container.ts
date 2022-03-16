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
import frameworkTemplate from "./templates/framework.template";
import featureTemplate from "./templates/feature.template";
import communityTemplate from "./templates/community.template";
import productTemplate from "./templates/product.template";

export class ContentPlacementContainer extends FASTElement {
    @attr section: string;

    frameworkData: FrameworkContentPlacementData[] = frameworkContentPlacementData;
    featureData: FeatureCardData[] = featureCardData;
    communityData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Medium"
    );
    productData: ProductData[] = productData;

    dataByType = {
        framework: this.frameworkData,
        feature: this.featureData,
        community: this.communityData,
        product: this.productData,
    };

    templateByType = {
        framework: frameworkTemplate,
        feature: featureTemplate,
        community: communityTemplate,
        product: productTemplate,
    };

    selectTemplate() {
        return this.templateByType[this.section];
    }

    selectData() {
        return this.dataByType[this.section];
    }
}
