import { Direction } from "@microsoft/fast-application-utilities";

export interface IDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
    direction: Direction;
}

const designSystemDefaults: IDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
    direction: Direction.ltr
};

export default designSystemDefaults;
