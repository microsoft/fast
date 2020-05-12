import React from "react";
import { Label, Toggle } from "@microsoft/fast-components-react-msft";
import { Direction } from "@microsoft/fast-web-utilities";
import { selectorStyle } from "../style";
import { DirectionSwitchProps } from "./direction-switch.props";

export const DirectionSwitch: React.FC<DirectionSwitchProps> = ({
    id,
    direction,
    onUpdateDirection,
    disabled,
}: React.PropsWithChildren<DirectionSwitchProps>): React.ReactElement => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Label htmlFor={id} style={selectorStyle}>
                RTL
            </Label>
            <Toggle
                inputId={id}
                onClick={onUpdateDirection}
                selected={direction === Direction.rtl}
                selectedMessage={""}
                unselectedMessage={""}
                statusMessageId={"direction"}
                disabled={disabled}
            />
        </div>
    );
};

export * from "./direction-switch.props";
