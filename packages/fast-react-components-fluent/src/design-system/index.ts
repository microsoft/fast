export interface IFluentDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    size: number;
}

const fluentDesignSystemDefaults: IFluentDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
    size: 1
};

export default fluentDesignSystemDefaults;
