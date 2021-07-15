interface FeatureLink {
    anchorText: string;
    url: string;
}
export interface FeatureCardData {
    header: string;
    body: string;
    links?: FeatureLink[];
}
export declare const featureCardData: FeatureCardData[];
export {};
