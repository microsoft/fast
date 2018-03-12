export interface IDevSiteDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    lightGrey: string;
    navigationBarHeight: number;
    categoryItemComponentMinWidth: number;
}

const devSiteDesignSystemDefaults: IDevSiteDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
    lightGrey: "#EEEEEE",
    navigationBarHeight: 48,
    categoryItemComponentMinWidth: 80
};

export default devSiteDesignSystemDefaults;
