import designSystemDefaults, { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { normalContrast } from "../utilities/colors";
import { IDividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { contrast, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import Chroma from "chroma-js";

const styles: ComponentStyles<IDividerClassNameContract, IDesignSystem> = {

    divider: {
        boxSizing: "content-box",
        height: toPx(0),
        marginTop: toPx(12),
        marginBottom: toPx(12),
        border: "none",
        borderTop: (config: IDesignSystem): string => {
            const designSystem: IDesignSystem = withDesignSystemDefaults(config);
            const borderColor: string = normalContrast(designSystem.contrast, designSystem.foregroundColor, designSystem.backgroundColor);
            return `${toPx(1)} solid ${borderColor}`;
        }
    }
};

export default styles;
