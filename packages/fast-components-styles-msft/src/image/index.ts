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
    image__picture: {
        display: "block"
    },
    image_img: {}
};

export default styles;
