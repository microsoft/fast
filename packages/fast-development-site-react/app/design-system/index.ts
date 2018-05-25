export enum Direction {
    ltr = "ltr",
    rtl = "rtl"
}

export interface IDesignSystem {
    ltr: Direction;
}

const designSystemDefaults: IDesignSystem = {
    ltr: Direction.ltr
};

export default designSystemDefaults;
