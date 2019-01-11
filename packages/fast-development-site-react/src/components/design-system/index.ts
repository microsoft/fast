export interface DevSiteDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    background000?: string;
    background100?: string;
    background200?: string;
    background300?: string;
    background350?: string;
    background800?: string;
    foreground300?: string;
    foreground800?: string;
    navigationBarHeight: number;
    categoryItemComponentMinWidth: number;
}

const devSiteDesignSystemDefaults: DevSiteDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#FB356D",
    background000: "#000",
    background100: "#1A1A1A",
    background200: "#1E1E1E",
    background300: "#212121",
    background350: "#2E2E2E",
    background800: "#303030",
    foreground300: "#F2F2F2",
    foreground800: "#D5D5D5",
    navigationBarHeight: 48,
    categoryItemComponentMinWidth: 80,
};

export default devSiteDesignSystemDefaults;
