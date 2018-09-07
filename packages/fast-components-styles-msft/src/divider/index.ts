import designSystemDefaults, { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { normalContrast } from "../utilities/colors";
import { density } from "../utilities/density";
import { IDividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { contrast, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";

const styles: ComponentStyles<IDividerClassNameContract, IDesignSystem> = (
    config: IDesignSystem
): ComponentStyleSheet<IDividerClassNameContract, IDesignSystem> => {
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);

    return {
        divider: {
            boxSizing: "content-box",
            height: "0",
            margin: `${density(designSystem.designUnit * 3)(designSystem)} 0`,
            border: "none",
            borderTop: `1px solid ${normalContrast(designSystem.contrast, designSystem.foregroundColor, designSystem.backgroundColor)}`
        }
    };
};

export default styles;
