import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IImageClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

function applyImageStyles(): ICSSRules<IDesignSystem> {
    return {
        display: "block",
        margin: "0",
        maxWidth: "100%",
        height: "auto"
    };
}

const styles: ComponentStyles<IImageClassNameContract, IDesignSystem> = {
    image: {
        ...applyImageStyles()
    },
    image__picture: {
        display: "block"
    },
    image_img: {
        ...applyImageStyles()
    }
};

export default styles;
