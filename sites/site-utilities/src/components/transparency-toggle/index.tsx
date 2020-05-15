import React from "react";
import { Label, Toggle } from "@microsoft/fast-components-react-msft";
import { selectorStyle } from "../style";
import { TransparencyToggleProps } from "./transparency-toggle.props";

export const TransparencyToggle: React.FC<TransparencyToggleProps> = ({
    id,
    transparency,
    onUpdateTransparency,
    disabled,
}: React.PropsWithChildren<TransparencyToggleProps>): React.ReactElement => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Label htmlFor={id} style={selectorStyle}>
                Transparent
            </Label>
            <Toggle
                inputId={id}
                onClick={onUpdateTransparency}
                selectedMessage={""}
                unselectedMessage={""}
                statusMessageId={"transparency"}
                selected={transparency}
                disabled={disabled}
            />
        </div>
    );
};
