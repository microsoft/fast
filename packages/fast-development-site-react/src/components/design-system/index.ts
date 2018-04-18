export interface IDevSiteDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    lightGray: string;
    navigationBarHeight: number;
    categoryItemComponentMinWidth: number;
}

const devSiteDesignSystemDefaults: IDevSiteDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#343434",
    lightGray: "#F4F5F6",
    navigationBarHeight: 48,
    categoryItemComponentMinWidth: 80
};

export default devSiteDesignSystemDefaults;
