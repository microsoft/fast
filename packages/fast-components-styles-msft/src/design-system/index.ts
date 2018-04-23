export interface IDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    gray: string;
}

const designSystemDefaults: IDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
    gray: "#757575"
};

export default designSystemDefaults;
