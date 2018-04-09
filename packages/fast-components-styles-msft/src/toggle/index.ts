import {IDesignSystem, hexToRGB} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {toPx} from "../utilities/units";
import {typeRamp} from "../utilities/typography";
import {IToggleClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = {
    toggle: {
        '& > label': {
            display: 'inline-block',
            fontSize: '13px',
            lineHeight: '20px',
            marginTop: toPx(21),
            paddingBottom: toPx(7),
            float: 'left',
            clear: 'left',
            '& + div': {
                marginTop: '0',
                float: 'left',
                clear: 'left',
                '& + span': {
                    float: 'left',
                    marginLeft: toPx(5)
                }
            }
        },
        '& span': {
            userSelect: 'none',
            marginTop: '0',
            paddingBottom: '0'
        },
        '&[aria-disabled="true"]': {
            color: (config: IDesignSystem): string => {
                return hexToRGB(config.foregroundColor, .2);
            }
        },
        '& > div': {
            position: 'relative',
            '& > span': {
                position: 'absolute',
                pointerEvents: 'none',
                left: toPx(5),
                top: toPx(5),
                transition: 'all .1s ease',
                backgroundColor: (config: IDesignSystem): string => {
                    return config.backgroundColor;
                },   
                content: "''",
                borderRadius: toPx(10),
                width: toPx(10),
                height: toPx(10)
            },
            '& > input': {
                position: 'relative',
                margin: '0',
                width: toPx(44),
                height: toPx(20),
                background: 'transparent',
                border: `${toPx(1)} solid`,
                borderColor: (config: IDesignSystem): string => {
                    return config.foregroundColor;
                },
                borderRadius: toPx(20),
                appearance: 'none',
                cursor: 'pointer',
                '@media screen and (-ms-high-contrast)': {
                    '&:after, &:checked+span': {
                        background: (config: IDesignSystem): string => {
                            return config.backgroundColor;
                        }
                    }
                },
                '@media screen and (-ms-high-contrast: black-on-white)': {
                    '&:after, &:checked+span': {
                        background: (config: IDesignSystem): string => {
                            return config.foregroundColor;
                        }
                    }
                },
                '&:checked': {
                    backgroundColor: (config: IDesignSystem): string => {
                        return config.brandColor;
                    },
                    borderColor: (config: IDesignSystem): string => {
                        return config.brandColor;
                    },
                    '&:hover': {
                        backgroundColor: (config: IDesignSystem): string => {
                            return hexToRGB(config.brandColor, .8);
                        },
                        borderColor: (config: IDesignSystem): string => {
                            return hexToRGB(config.brandColor, .8);
                        }
                    },
                    '&:focus': {
                        borderColor: (config: IDesignSystem): string => {
                            return config.brandColor;
                        }
                    },
                    '& + span': {
                        left: '28px',
                        backgroundColor: (config: IDesignSystem): string => {
                            return config.backgroundColor;
                        }
                    },
                    '&:disabled': {
                        cursor: 'not-allowed',
                        background: (config: IDesignSystem): string => {
                            return hexToRGB(config.foregroundColor, .2);
                        },
                        borderColor: 'transparent',
                        '& + span': {
                            background: (config: IDesignSystem): string => {
                                return hexToRGB(config.foregroundColor, .2);
                            }
                        },
                        '&:hover': {
                            borderColor: 'transparent'
                        }
                    }
                },
                '&:not(:checked)': {
                    background: 'transparent',
                    borderColor: (config: IDesignSystem): string => {
                        return config.foregroundColor;
                    },
                    '& + span': {
                        backgroundColor: (config: IDesignSystem): string => {
                            return config.foregroundColor;
                        }
                    },
                    '&:disabled': {
                        cursor: 'not-allowed',
                        background: 'transparent',
                        borderColor: (config: IDesignSystem): string => {
                            return hexToRGB(config.foregroundColor, .2);
                        },
                        '& + span': {
                            backgroundColor: (config: IDesignSystem): string => {
                                return hexToRGB(config.foregroundColor, .2);
                            }
                        }
                    }
                },
                '&:focus': {
                    outline: '0'
                }
            }
        }
    }
};

export default styles;
