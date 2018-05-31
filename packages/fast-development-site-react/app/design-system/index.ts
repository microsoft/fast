import { Direction } from "@microsoft/fast-application-utilities";

export interface IDesignSystem {
    ltr: Direction;
}

const designSystemDefaults: IDesignSystem = {
    ltr: Direction.ltr
};

export default designSystemDefaults;
