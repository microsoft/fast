import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ICheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { toPx } from "@microsoft/fast-jss-utilities";
import * as Chroma from "chroma-js";
import { relative } from "path";

const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = {
    checkbox: {
        display: "flex",
        flexDirection: "row",
        verticalAlign: "middle"
    },
    // checkbox_input: {
    //     position: "absolute",
    //     cursor: "pointer",
    //     width: toPx(20),
    //     height: toPx(20),
    //     appearance: "none",
    //     border: `${toPx(1)} solid`,
    //     borderRadius: toPx(2),
    //     borderColor: (config: IDesignSystem): string => {
    //         return Chroma.mix(config.foregroundColor, config.backgroundColor, 0.46).css();
    //     },
    //     "&:after, &:before": {
    //         position: "absolute",
    //         display: "block",
    //         content: "''",
    //         width: toPx(1),
    //         // TODO: Issue #309 https://github.com/Microsoft/fast-dna/issues/309
    //         // background: (config: IDesignSystem): string => {
    //         //     return config.foregroundColor;
    //         // },
    //         background: "black"
    //     },
    //     "&:focus": {
    //         outline: "none",
    //         borderWidth: toPx(2),
    //         "&:checked": {
    //             "&:before": {
    //                 left: toPx(4),
    //                 top: toPx(8)
    //             },
    //             "&:after": {
    //                 left: toPx(9),
    //                 top: toPx(3)
    //             }
    //         },
    //         "&:indeterminate, &:indeterminate:checked": {
    //             "&:before": {
    //                 left: toPx(3),
    //                 top: toPx(3)
    //             },
    //             "&:after": {
    //                 display: "none"
    //             }
    //         }
    //     },
    //     "&:checked": {
    //         "&:before": {
    //             height: toPx(5),
    //             left: toPx(5),
    //             top: toPx(9),
    //             transform: "rotate(-45deg)"
    //         },
    //         "&:after": {
    //             height: toPx(11),
    //             left: toPx(10),
    //             top: toPx(4),
    //             transform: "rotate(45deg)"
    //         }
    //     },
    //     "&:indeterminate, &:indeterminate:checked": {
    //         "&:before": {
    //             display: "block",
    //             transform: "none",
    //             left: toPx(4),
    //             top: toPx(4),
    //             height: toPx(10),
    //             width: toPx(10)
    //         },
    //         "&:after": {
    //             display: "none"
    //         }
    //     }
    // },
    checkbox_input: {
        position: "absolute",
        cursor: "pointer",
        width: toPx(20),
        height: toPx(20),
        opacity: "0",
        border: `${toPx(1)} solid`,
        borderRadius: toPx(2),
        boxSizing: "content-box",
        margin: "0",
        borderColor: (config: IDesignSystem): string => {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, 0.46).css();
        },
        "&:focus": {
            outline: "none",
            "& + span": {
                borderWidth: toPx(2)
            },
            "&:checked": {
                "& + span": {
                    "&:after, &:before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "''",
                        borderRadius: toPx(2),
                        width: toPx(2),
                        background: "black"
                    }
                }
            },
            // "&:indeterminate, &:indeterminate:checked": {
            //     "& + span": {
            //         "&:before": {
            //             top: toPx(4),
            //             left: toPx(11)
            //         },
            //         "&:after": {
            //             top: toPx(9),
            //             left: toPx(6),
            //         }
            //     }
            // }
        },
        "&:checked": {
            "& + span": {
                "&:after, &:before": {
                    position: "absolute",
                    zIndex: "1",
                    content: "''",
                    borderRadius: toPx(2),
                    width: toPx(2),
                    background: "black"
                }
            }
        }
    },
    checkbox_span: {
        position: "relative",
        border: `${toPx(1)} solid`,
        borderColor: (config: IDesignSystem): string => {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, 0.46).css();
        },
        borderRadius: toPx(2),
        display: "inline-block",
        width: "20px",
        height: "20px",
        "&:before": {
            top: toPx(4),
            left: toPx(11),
            height: toPx(12),
            transform: "rotate(40deg)"
        },
        "&:after": {
            top: toPx(9),
            left: toPx(6),
            height: toPx(6),
            transform: "rotate(-45deg)"
        },
        "&:focus": {
            // borderWidth: toPx(2)
        }
        // "&:after, &:before": {
        //     width: toPx(1),
        //     // TODO: Issue #309 https://github.com/Microsoft/fast-dna/issues/309
        //     // background: (config: IDesignSystem): string => {
        //     //     return config.foregroundColor;
        //     // },
        //     background: "black"
        // },
        // "& $checkbox_input:checked": {
        //     "&:after, &:before": {
        //         position: "absolute",
        //         zIndex: "1",
        //         content: "''",
        //         borderRadius: toPx(2),
        //         width: toPx(2),
        //         background: "black"
        //     }
        // }
    },
    checkbox_label: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        ...applyTypeRampConfig("t7"),
        marginLeft: toPx(5),
        marginTop: toPx(2)
    },
    checkbox_disabled: {
        "& $checkbox_input, & $checkbox_label": {
            cursor: "default",
            opacity: ".6"
        }
    }
};

export default styles;
