import { Direction } from "@microsoft/fast-jss-utilities";

export interface DirectionSwitchProps {
    className?: string;
    id: string;
    direction: Direction;
    onUpdateDirection: any;
    disabled: boolean;
}
