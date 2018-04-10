import { fontWeight } from "../utilities/fonts";

export interface IDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
}

const designSystemDefaults: IDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4"
};

export default designSystemDefaults;
