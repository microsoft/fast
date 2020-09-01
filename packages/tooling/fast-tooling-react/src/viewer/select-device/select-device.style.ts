import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import { DesignSystem, selectInputStyle, selectSpanStyle } from "../../style";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";

const styles: ComponentStyles<
    SelectDeviceClassNameContract,
    {}
> = (): ComponentStyleSheet<SelectDeviceClassNameContract, DesignSystem> => {
    return {
        selectDevice: {
            display: "inline-block",
            verticalAlign: "text-bottom",
        },
        selectDevice_label: {
            lineHeight: "16px",
            fontSize: "14px",
            marginRight: "16px",
            ...ellipsis(),
        },
        selectDevice_contentRegion: {
            ...selectSpanStyle,
        },
        selectDevice_select: {
            ...selectInputStyle,
            paddingRight: "15px",
        },
    };
};

export default styles;
