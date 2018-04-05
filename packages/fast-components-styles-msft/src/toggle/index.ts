import {IDesignSystem, hexToRGB} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {IToggleClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = {
    toggle: {
        '& > label': {
            display: 'inline-block',
            fontSize: '13px',
            lineHeight: '20px',
            marginTop: '21px',
            paddingBottom: '7px',
            float: 'left',
            clear: 'left',
            '& + div': {
                marginTop: '0',
                float: 'left',
                clear: 'left',
                '& + span': {
                    float: 'left',
                    marginLeft: '5px'
                }
            }
        },
        '& span': {
            userSelect: 'none',
            marginTop: '0',
            paddingBottom: '0',
            cursor: 'pointer'
        },
        '& > div': {
            position: 'relative',
            '& > span': {
                position: 'absolute',
                pointerEvents: 'none',
                left: '5px',
                top: '5px',
                transition: 'all .1s ease',
                backgroundColor: (config: IDesignSystem): string => {
                    return config.backgroundColor;
                },   
                content: "''",
                borderRadius: '10px',
                width: '10px',
                height: '10px'
            },
            '& > input': {
                position: 'relative',
                margin: '0',
                width: '44px',
                height: '20px',
                background: 'transparent',
                border: '1px solid',
                borderColor: (config: IDesignSystem): string => {
                    return config.foregroundColor;
                },
                borderRadius: '20px',
                appearance: 'none',
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
                        background: (config: IDesignSystem): string => {
                            return hexToRGB(config.foregroundColor, .2);
                        },
                        borderColor: 'transparent',
                        '& + span': {
                            background: (config: IDesignSystem): string => {
                                return hexToRGB(config.foregroundColor, .2);
                            }
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
                },
                '&:disabled': {
                    background: 'transparent',
                    borderColor: (config: IDesignSystem): string => {
                        return hexToRGB(config.foregroundColor, .2);
                    },
                    '& + span': {
                        backgroundColor: (config: IDesignSystem): string => {
                            return hexToRGB(config.foregroundColor, .2);
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