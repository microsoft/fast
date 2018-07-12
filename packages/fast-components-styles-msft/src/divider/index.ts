import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IDividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import * as Chroma from "chroma-js";

const styles: ComponentStyles<IDividerClassNameContract, IDesignSystem> = {

    divider: {
        boxSizing: "content-box",
        height: toPx(0),
        marginTop: toPx(12),
        marginBottom: toPx(12),
        border: "none",
        borderTop: (config: IDesignSystem): string => {
            return `${toPx(1)} solid ${Chroma(get(config, "foregroundColor") || designSystemDefaults.foregroundColor).alpha(0.2).css()}`;
        }
    }
};

export default styles;
