import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { ImageClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

function applyImageStyles(): CSSRules<DesignSystem> {
    return {
        display: "block",
        margin: "0",
        maxWidth: "100%",
        height: "auto"
    };
}

const styles: ComponentStyles<ImageClassNameContract, DesignSystem> = {
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
