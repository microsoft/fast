export interface DevSiteDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    lightGray: string;
    navigationBarHeight: number;
    categoryItemComponentMinWidth: number;
}

const devSiteDesignSystemDefaults: DevSiteDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#FB356D",
    // TODO: Rename?
    lightGray: "#212121",
    navigationBarHeight: 48,
    categoryItemComponentMinWidth: 80,
};

export default devSiteDesignSystemDefaults;
