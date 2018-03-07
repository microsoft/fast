export interface IFluentDesignSystem {
    controlBackplateColorPrimary: string;
    controlBackplateColorSecondary: string;
    controlBackplateTransition: string;
    controlBackplateTextColor: string;
    controlLinkTextColor: string;
    controlTextSize: number;
    controlTextPaddingHorizontal: number;
    controlBackplateRadius: number;
    controlBackplateZoom: number;
    controlBorderSize: number;
    controlBorderColor: string;
    controlBorderStyle: string;
    controlMarginTop: number;
    controlHeight: number;
    typographyColor: string;
    typographySize: number;
    systemAccentColor: string;
    systemDensityModifier: number;
    systemGridUnit: number;
    controlCursorDisabled: string;
    controlCursorActive: string;
}

const fluentDesignSystemDefaults: IFluentDesignSystem = {
    controlBackplateColorPrimary: "#005fa7",
    controlBackplateColorSecondary: "rgba(0,0,0,.2)",
    controlBackplateTransition: "all .2s ease-in-out",
    controlBackplateTextColor: "#000",
    controlLinkTextColor: "#000",
    controlTextSize: 14,
    controlTextPaddingHorizontal: 16,
    controlBackplateRadius: 2,
    controlBackplateZoom: 2,
    controlBorderSize: 2,
    controlBorderColor: "transparent",
    controlBorderStyle: "solid",
    controlMarginTop: 12,
    controlHeight: 44,
    typographyColor: "#FFF",
    typographySize: 15,
    systemAccentColor: "#0078D4",
    systemDensityModifier: 1,
    systemGridUnit: 4,
    controlCursorDisabled: "not-allowed",
    controlCursorActive: "default"
};

export default fluentDesignSystemDefaults;
