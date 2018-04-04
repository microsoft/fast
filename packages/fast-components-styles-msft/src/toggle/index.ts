import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {IToggleClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = {
    toggle: {
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
                '&:checked': {
                    backgroundColor: (config: IDesignSystem): string => {
                        return config.brandColor;
                    },
                    borderColor: (config: IDesignSystem): string => {
                        return config.brandColor;
                    },
                    '& + span': {
                        left: '28px',
                        backgroundColor: (config: IDesignSystem): string => {
                            return config.backgroundColor;
                        }
                    },
                    '&:disabled': {
                        background: 'rgba(0,0,0,.2)',
                        borderColor: 'transparent',
                        '& + span': {
                            background: 'rgba(0,0,0,.2)'
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
                    borderColor:  'rgba(0,0,0,.2)'
                },
                '&:focus': {
                    outline: '0'
                }
            }
        }
    }
};

export default styles;