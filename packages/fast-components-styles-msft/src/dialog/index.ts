import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { IDialogClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import Chroma from "chroma-js";

/* tslint:disable-next-line */
const styles: ComponentStyles<IDialogClassNameContract, IDesignSystem> = {
    dialog: {},
    dialog_modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: (config: IDesignSystem): string => Chroma(config.backgroundColor).alpha(0.9).css(),
        "&::before": {
            // applyAcrylic
        }
    },
    dialog_contentRegion: {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: `${toPx(0)} ${toPx(25.6)} ${toPx(57.6)} rgba(0,0,0,0.22), ${toPx(0)} ${toPx(4.8)} ${toPx(14.4)} rgba(0,0,0,0.18)`
    }
};

export default styles;
