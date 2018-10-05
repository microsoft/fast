import { Direction } from "@microsoft/fast-application-utilities";

export interface DesignSystem {
    ltr: Direction;
}

const designSystemDefaults: DesignSystem = {
    ltr: Direction.ltr
};

export default designSystemDefaults;
export { Direction };
