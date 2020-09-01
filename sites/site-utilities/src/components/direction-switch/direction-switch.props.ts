import { Direction } from "@microsoft/fast-jss-utilities";

export interface DirectionSwitchProps {
    id: string;
    direction: Direction;
    onUpdateDirection: any;
    disabled: boolean;
}
