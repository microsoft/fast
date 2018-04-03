import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {IMediaClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IMediaClassNameContract, IDesignSystem> = {
    media: {
        display: string => {
            return "block";
        },
        margin: string => {
            return "0"
        },
        maxWidth: string => {
            return "100%"
        },
        height: string => {
            return "auto"
        },
        "img.c-image": {
            "&.o-round": {
                borderRadius: string => {
                    return "50%"
                }
            }
        },
        "picture.c-image": {
            display: string => {
                return "block";
            },
            "img": {

            }
        },
        "picture.c-image,img.c-image": {
            "&.o-pad-3x-bottom": {
                paddingBottom: string => {
                    return "$base-3x";
                }
            }
        }
    },
};

export default styles;
