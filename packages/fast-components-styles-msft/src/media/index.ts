import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IMediaClassNameContract } from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IMediaClassNameContract, IDesignSystem> = {
    image: {
        display: "block",
        margin: "0",
        maxWidth: "100%",
        height: "auto"
    },
    image_round: {
        borderRadius: "50%"
    },
    picture: {
        display: "block"
    }
};

export default styles;
