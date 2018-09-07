import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IImageClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

const styles: ComponentStyles<IImageClassNameContract, IDesignSystem> = {
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
