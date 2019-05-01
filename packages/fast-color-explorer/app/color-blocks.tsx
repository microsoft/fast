import {
    Background,
    Button,
    ButtonAppearance,
    Caption,
    Checkbox,
    Hypertext,
    Paragraph,
    TextField,
} from "@microsoft/fast-components-react-msft";
import React from "react";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import {
    accentFill,
    accentFillRest,
    accentForeground,
    accentForegroundCut,
    backgroundColor,
    neutralFill,
    neutralFillStealth,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralOutline,
} from "@microsoft/fast-components-styles-msft";
import classnames from "classnames";
import { Swatch, SwatchStates } from "./swatch";
import { ColorsDesignSystem } from "./design-system";
import { HintText } from "./hint-text";
import { get, isEqual, uniqueId } from "lodash-es";
import { AppState, ComponentTypes } from "./state";
import { connect } from "react-redux";
import { ButtonClassNameContract } from "@microsoft/fast-components-react-base";
import {
    FillSwatchFamily,
    SwatchFamily,
} from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";

const styles: any = {
    colorBlocks: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "stretch",
        textAlign: "center",
        color: neutralForegroundRest,
        position: "relative",
        transition: "opacity .1s linear",
        background: backgroundColor,
        height: "100%",
    },
    colorBlocks_title: {
        lineHeight: "36px",
        textAlign: "center",
        color: accentForegroundCut,
        background: accentFillRest,
    },
    colorBlocks_backgroundColor: {
        marginTop: "4px",
    },
    colorBlocks_content: {
        flexGrow: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    colorBlocks_example: {
        height: "60px",
        display: "flex",
        alignItems: "center",
    },
};

interface ColorBlocksClassNameContract {
    colorBlocks: string;
    colorBlocks_title: string;
    colorBlocks_backgroundColor: string;
    colorBlocks_content: string;
    colorBlocks_example: string;
}

interface ColorBlocksManagedClasses {
    managedClasses: ColorBlocksClassNameContract;
}

interface ColorBlocksProps extends ColorBlocksManagedClasses {
    index: number;

    component: ComponentTypes;

    designSystem: ColorsDesignSystem;

    backgroundColor: string;
}

interface ColorBlocksState {
    designSystem: ColorsDesignSystem;
}

class ColorBlocksBase extends React.Component<ColorBlocksProps, ColorBlocksState> {
    public static getDerivedStateFromProps(
        props: ColorBlocksProps,
        state: ColorBlocksState
    ): Partial<ColorBlocksState> | null {
        if (
            props.backgroundColor !== undefined || // TODO: fix this - was state.backgroundColor but that is always undefined
            props.designSystem !== state.designSystem
        ) {
            return {
                designSystem: Object.assign({}, props.designSystem, {
                    backgroundColor: props.backgroundColor,
                }),
            };
        }

        return null;
    }

    private titleStyleOverrides: any = {
        caption: {
            margin: "20px 0 12px",
            color: neutralForegroundRest,
        },
    };

    private stealthButtonOverrides: ComponentStyleSheet<
        ButtonClassNameContract,
        ColorsDesignSystem
    > = {
        button: {
            width: "40px",
            height: "40px",
            minWidth: "unset",
        },
    };
    constructor(props: ColorBlocksProps) {
        super(props);

        this.state = {
            designSystem: Object.assign({}, props.designSystem, {
                backgroundColor: props.backgroundColor,
            }),
        };
    }

    public render(): React.ReactNode {
        return (
            <Background
                value={this.state.designSystem.backgroundColor}
                className={this.generateClassName()}
                id={`${this.state.designSystem.backgroundColor
                    .toUpperCase()
                    .replace("#", "")}`}
            >
                <div className={this.props.managedClasses.colorBlocks_title}>
                    {this.props.index}
                </div>
                <div className={this.props.managedClasses.colorBlocks_backgroundColor}>
                    <Caption>
                        {this.state.designSystem.backgroundColor.toUpperCase()}
                    </Caption>
                </div>

                <div className={this.props.managedClasses.colorBlocks_content}>
                    {this.renderComponent()}
                </div>
            </Background>
        );
    }

    public shouldComponentUpdate(
        props: ColorBlocksProps,
        state: ColorBlocksState
    ): boolean {
        return !isEqual(props, this.props);
    }

    private generateClassName(): string {
        return classnames(this.props.managedClasses.colorBlocks);
    }

    private renderExample(child: JSX.Element): JSX.Element {
        return (
            <div className={get(this.props.managedClasses, "colorBlocks_example")}>
                {child}
            </div>
        );
    }

    private renderComponent(): React.ReactNode {
        switch (this.props.component) {
            case ComponentTypes.neutral:
                return this.renderNeutralComponent();
            case ComponentTypes.accent:
                return this.renderAccentComponent();
            case ComponentTypes.stealth:
                return this.renderStealthComponent();
            case ComponentTypes.ghost:
                return this.renderGhostComponent();
            case ComponentTypes.text:
                return this.renderTextComponent();
        }
    }

    private renderAccentComponent(): React.ReactNode {
        const backgroundColors: FillSwatchFamily = accentFill(this.state.designSystem);
        const textColor: string = accentForegroundCut(this.state.designSystem);

        return (
            <React.Fragment>
                {this.renderExample(
                    <Button appearance={ButtonAppearance.primary}>Accent</Button>
                )}

                <Caption jssStyleSheet={this.titleStyleOverrides}>ACCENT / FILL</Caption>
                <Swatch
                    color={backgroundColors.rest}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.rest}
                />
                <Swatch
                    color={backgroundColors.hover}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.hover}
                />
                <Swatch
                    color={backgroundColors.active}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.active}
                />
                <Swatch
                    color={backgroundColors.selected}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={accentForegroundCut(() => backgroundColors.selected)(
                        {} as ColorsDesignSystem
                    )}
                    state={SwatchStates.selected}
                />
                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    ACCENT / FOREGROUND / CUT
                </Caption>
                <Swatch
                    showTextContrast={false}
                    showBackgroundContrast={false}
                    color={textColor}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: textColor,
                        })
                    )}
                />
            </React.Fragment>
        );
    }
    private renderNeutralComponent(): React.ReactNode {
        const backgroundColors: FillSwatchFamily = neutralFill(this.state.designSystem);
        const textColor: string = neutralForegroundRest(this.state.designSystem);

        return (
            <React.Fragment>
                {this.renderExample(<Button>Neutral</Button>)}
                <Caption jssStyleSheet={this.titleStyleOverrides}>NEUTRAL / FILL</Caption>
                <Swatch
                    color={backgroundColors.rest}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.rest}
                />
                <Swatch
                    color={backgroundColors.hover}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.hover}
                />
                <Swatch
                    color={backgroundColors.active}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.active}
                />
                <Swatch
                    color={backgroundColors.selected}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        (): string => backgroundColors.selected
                    )({} as any)}
                    state={SwatchStates.selected}
                />
                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FOREGROUND
                </Caption>
                <Swatch
                    showTextContrast={false}
                    showBackgroundContrast={false}
                    color={textColor}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: textColor,
                        })
                    )}
                />
            </React.Fragment>
        );
    }
    private renderStealthComponent(): React.ReactNode {
        const backgroundColors: FillSwatchFamily = neutralFillStealth(
            this.state.designSystem
        );
        const textColor: string = neutralForegroundRest(this.state.designSystem);

        return (
            <React.Fragment>
                {this.renderExample(
                    <Button
                        appearance={ButtonAppearance.stealth}
                        jssStyleSheet={this.stealthButtonOverrides}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M13.9297 7.71875C13.9297 7.76562 13.9297 7.8125 13.9297 7.85938C13.9349 7.90625 13.9375 7.95312 13.9375 8C13.9375 8.04688 13.9349 8.09375 13.9297 8.14062C13.9297 8.1875 13.9297 8.23438 13.9297 8.28125L15.9531 9.53906L14.7109 12.5312L12.3906 12C12.2656 12.1354 12.1354 12.2656 12 12.3906L12.5312 14.7109L9.53906 15.9531L8.28125 13.9297C8.23438 13.9297 8.1875 13.9323 8.14062 13.9375C8.09375 13.9375 8.04688 13.9375 8 13.9375C7.95312 13.9375 7.90625 13.9375 7.85938 13.9375C7.8125 13.9323 7.76562 13.9297 7.71875 13.9297L6.46094 15.9531L3.46875 14.7109L4 12.3906C3.86458 12.2656 3.73438 12.1354 3.60938 12L1.28906 12.5312L0.046875 9.53906L2.07031 8.28125C2.07031 8.23438 2.06771 8.1875 2.0625 8.14062C2.0625 8.09375 2.0625 8.04688 2.0625 8C2.0625 7.95312 2.0625 7.90625 2.0625 7.85938C2.06771 7.8125 2.07031 7.76562 2.07031 7.71875L0.046875 6.46094L1.28906 3.46875L3.60938 4C3.73438 3.86458 3.86458 3.73438 4 3.60938L3.46875 1.28906L6.46094 0.046875L7.71875 2.07031C7.76562 2.07031 7.8125 2.07031 7.85938 2.07031C7.90625 2.0651 7.95312 2.0625 8 2.0625C8.04688 2.0625 8.09375 2.0651 8.14062 2.07031C8.1875 2.07031 8.23438 2.07031 8.28125 2.07031L9.53906 0.046875L12.5312 1.28906L12 3.60938C12.1354 3.73438 12.2656 3.86458 12.3906 4L14.7109 3.46875L15.9531 6.46094L13.9297 7.71875ZM13.0156 8.73438C13.026 8.60938 13.0365 8.48698 13.0469 8.36719C13.0573 8.24219 13.0625 8.11719 13.0625 7.99219C13.0625 7.8724 13.0573 7.75 13.0469 7.625C13.0365 7.5 13.026 7.3776 13.0156 7.25781L14.8594 6.10938L14.1875 4.48438L12.0703 4.97656C11.9089 4.77865 11.7422 4.59635 11.5703 4.42969C11.4036 4.26302 11.2214 4.09635 11.0234 3.92969L11.5156 1.8125L9.89062 1.14062L8.73438 2.98438C8.61458 2.97396 8.49219 2.96354 8.36719 2.95312C8.24219 2.94271 8.11979 2.9375 8 2.9375C7.875 2.9375 7.75 2.94271 7.625 2.95312C7.50521 2.96354 7.38281 2.97396 7.25781 2.98438L6.10938 1.14062L4.48438 1.8125L4.97656 3.92969C4.77865 4.09115 4.59635 4.25781 4.42969 4.42969C4.26302 4.59635 4.09635 4.77865 3.92969 4.97656L1.8125 4.48438L1.14062 6.10938L2.98438 7.26562C2.97396 7.39062 2.96354 7.51562 2.95312 7.64062C2.94271 7.76042 2.9375 7.88281 2.9375 8.00781C2.9375 8.1276 2.94271 8.25 2.95312 8.375C2.96354 8.5 2.97396 8.6224 2.98438 8.74219L1.14062 9.89062L1.8125 11.5156L3.92969 11.0234C4.09115 11.2214 4.25521 11.4036 4.42188 11.5703C4.59375 11.737 4.77865 11.9036 4.97656 12.0703L4.48438 14.1875L6.10938 14.8594L7.26562 13.0156C7.38542 13.026 7.50781 13.0365 7.63281 13.0469C7.75781 13.0573 7.88021 13.0625 8 13.0625C8.125 13.0625 8.2474 13.0573 8.36719 13.0469C8.49219 13.0365 8.61719 13.026 8.74219 13.0156L9.89062 14.8594L11.5156 14.1875L11.0234 12.0703C11.2214 11.9089 11.4036 11.7448 11.5703 11.5781C11.737 11.4062 11.9036 11.2214 12.0703 11.0234L14.1875 11.5156L14.8594 9.89062L13.0156 8.73438ZM8 5.0625C8.40625 5.0625 8.78646 5.14062 9.14062 5.29688C9.5 5.44792 9.8125 5.65625 10.0781 5.92188C10.3438 6.1875 10.5521 6.5 10.7031 6.85938C10.8594 7.21354 10.9375 7.59375 10.9375 8C10.9375 8.40625 10.8594 8.78906 10.7031 9.14844C10.5521 9.5026 10.3438 9.8125 10.0781 10.0781C9.8125 10.3438 9.5 10.5547 9.14062 10.7109C8.78646 10.862 8.40625 10.9375 8 10.9375C7.59375 10.9375 7.21094 10.862 6.85156 10.7109C6.4974 10.5547 6.1875 10.3438 5.92188 10.0781C5.65625 9.8125 5.44531 9.5026 5.28906 9.14844C5.13802 8.78906 5.0625 8.40625 5.0625 8C5.0625 7.59375 5.13802 7.21354 5.28906 6.85938C5.44531 6.5 5.65625 6.1875 5.92188 5.92188C6.1875 5.65625 6.4974 5.44792 6.85156 5.29688C7.21094 5.14062 7.59375 5.0625 8 5.0625ZM8 10.0625C8.28646 10.0625 8.55469 10.0104 8.80469 9.90625C9.05469 9.79688 9.27344 9.64844 9.46094 9.46094C9.64844 9.27344 9.79427 9.05469 9.89844 8.80469C10.0078 8.55469 10.0625 8.28646 10.0625 8C10.0625 7.71354 10.0078 7.44531 9.89844 7.19531C9.79427 6.94531 9.64844 6.72656 9.46094 6.53906C9.27344 6.35156 9.05469 6.20573 8.80469 6.10156C8.55469 5.99219 8.28646 5.9375 8 5.9375C7.71354 5.9375 7.44531 5.99219 7.19531 6.10156C6.94531 6.20573 6.72656 6.35156 6.53906 6.53906C6.35156 6.72656 6.20312 6.94531 6.09375 7.19531C5.98958 7.44531 5.9375 7.71354 5.9375 8C5.9375 8.28646 5.98958 8.55469 6.09375 8.80469C6.20312 9.05469 6.35156 9.27344 6.53906 9.46094C6.72656 9.64844 6.94531 9.79688 7.19531 9.90625C7.44531 10.0104 7.71354 10.0625 8 10.0625Z" />
                        </svg>
                    </Button>
                )}

                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FILL / STEALTH
                </Caption>
                <Swatch
                    color={backgroundColors.rest}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.rest}
                />
                <Swatch
                    color={backgroundColors.hover}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.hover}
                />
                <Swatch
                    color={backgroundColors.active}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.active}
                />
                <Swatch
                    color={backgroundColors.selected}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(() => backgroundColors.selected)(
                        {} as ColorsDesignSystem
                    )}
                    state={SwatchStates.selected}
                />
                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FOREGROUND
                </Caption>
                <Swatch
                    showTextContrast={false}
                    showBackgroundContrast={false}
                    color={textColor}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: textColor,
                        })
                    )}
                />
            </React.Fragment>
        );
    }

    private renderGhostComponent(): React.ReactNode {
        const backgroundColors: FillSwatchFamily = neutralFillStealth(
            this.state.designSystem
        );
        const textColor: string = neutralForegroundRest(this.state.designSystem);
        const borderColors: SwatchFamily = neutralOutline(this.state.designSystem);

        return (
            <React.Fragment>
                {this.renderExample(
                    <Button appearance={ButtonAppearance.outline}>Ghost</Button>
                )}
                {this.renderExample(<TextField placeholder="jerry@microsoft.com" />)}
                {this.renderExample(
                    <Checkbox inputId={uniqueId()}>
                        <label slot="label">Checkbox</label>
                    </Checkbox>
                )}

                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FILL / STEALTH
                </Caption>
                <Swatch
                    color={backgroundColors.rest}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.rest}
                />
                <Swatch
                    color={backgroundColors.hover}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.hover}
                />
                <Swatch
                    color={backgroundColors.active}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={textColor}
                    state={SwatchStates.active}
                />
                <Swatch
                    color={backgroundColors.selected}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(() => backgroundColors.selected)(
                        {} as ColorsDesignSystem
                    )}
                    state={SwatchStates.selected}
                />
                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / OUTLINE
                </Caption>
                <Swatch
                    color={borderColors.rest}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: borderColors.hover,
                        })
                    )}
                    state={SwatchStates.rest}
                    showTextContrast={false}
                    showBackgroundContrast={false}
                />
                <Swatch
                    color={borderColors.hover}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: borderColors.hover,
                        })
                    )}
                    state={SwatchStates.hover}
                    showTextContrast={false}
                    showBackgroundContrast={false}
                />
                <Swatch
                    color={borderColors.active}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: borderColors.active,
                        })
                    )}
                    state={SwatchStates.active}
                    showTextContrast={false}
                    showBackgroundContrast={false}
                />
                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FOREGROUND
                </Caption>
                <Swatch
                    color={textColor}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    showTextContrast={false}
                    showBackgroundContrast={false}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: textColor,
                        })
                    )}
                />
            </React.Fragment>
        );
    }

    private renderTextComponent(): React.ReactNode {
        const accentColors: SwatchFamily = accentForeground(this.state.designSystem);

        return (
            <React.Fragment>
                {this.renderExample(<Paragraph>Neutral</Paragraph>)}

                {this.renderExample(
                    <Caption>
                        <HintText>Hint</HintText>
                    </Caption>
                )}

                {this.renderExample(<Hypertext href={"#"}>Accent</Hypertext>)}

                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FOREGROUND
                </Caption>
                <Swatch
                    color={neutralForegroundRest(this.state.designSystem)}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: neutralForegroundRest(
                                this.state.designSystem
                            ),
                        })
                    )}
                    state={SwatchStates.rest}
                    showTextContrast={false}
                />

                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    NEUTRAL / FOREGROUND / HINT
                </Caption>
                <Swatch
                    color={neutralForegroundHint(this.state.designSystem)}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={neutralForegroundRest(
                        Object.assign({}, this.state.designSystem, {
                            backgroundColor: neutralForegroundHint(
                                this.state.designSystem
                            ),
                        })
                    )}
                    state={SwatchStates.rest}
                    showTextContrast={false}
                />

                <Caption jssStyleSheet={this.titleStyleOverrides}>
                    ACCENT / FOREGROUND
                </Caption>
                <Swatch
                    color={accentColors.rest}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={accentForegroundCut(
                        (designSystem: ColorsDesignSystem): string => accentColors.rest
                    )(this.state.designSystem)}
                    state={SwatchStates.rest}
                    showTextContrast={false}
                />
                <Swatch
                    color={accentColors.hover}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={accentForegroundCut(
                        (designSystem: ColorsDesignSystem): string => accentColors.hover
                    )(this.state.designSystem)}
                    state={SwatchStates.hover}
                    showTextContrast={false}
                />
                <Swatch
                    color={accentColors.active}
                    backgroundColor={this.state.designSystem.backgroundColor}
                    textColor={accentForegroundCut(
                        (designSystem: ColorsDesignSystem): string => accentColors.active
                    )(this.state.designSystem)}
                    state={SwatchStates.active}
                    showTextContrast={false}
                />
            </React.Fragment>
        );
    }
}

/* tslint:disable-next-line */
const ColorBlocks = manageJss(styles)(ColorBlocksBase);
type ColorBlocks = InstanceType<typeof ColorBlocks>;

function mapStateToProps(state: AppState): Partial<ColorBlocksProps> {
    return {
        component: state.componentType,
        designSystem: state.designSystem,
    };
}

export default connect(mapStateToProps)(ColorBlocks);
