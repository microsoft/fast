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
    brandColor: "#343434",
    lightGrey: "#F4F5F6",
    navigationBarHeight: 48,
    categoryItemComponentMinWidth: 80
};

export default devSiteDesignSystemDefaults;
