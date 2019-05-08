import React from "react";
import { ColorsDesignSystem } from "./design-system";
import {
    Background,
    Button,
    ButtonAppearance,
    Caption,
    CaptionClassNameContract,
    Checkbox,
    Hypertext,
    Paragraph,
    TextField,
} from "@microsoft/fast-components-react-msft";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import {
    accentFill,
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentFillSelected,
    accentForeground,
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    backgroundColor,
    fontWeight,
    neutralFill,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillSelected,
    neutralFillStealth,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundRest,
    neutralOutline,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";
import classnames from "classnames";
import {
    Swatch,
    SwatchStates,
    SwatchTwo,
    SwatchTwoProps,
    SwatchTwoTypes,
} from "./swatch";
import { Omit } from "utility-types";
import { HintText } from "./hint-text";
import { get, isEqual, uniqueId } from "lodash-es";
import { AppState, ComponentTypes } from "./state";
import { connect } from "react-redux";
import { ButtonClassNameContract } from "@microsoft/fast-components-react-base";
import {
    FillSwatchFamily,
    SwatchFamily,
} from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";
import { StealthIcon } from "./icons";
import { format } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyleSheet<ColorBlocksClassNameContract, ColorsDesignSystem> = {
    colorBlocks: {
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
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
        margin: "16px auto 4px",
        fontWeight: fontWeight.semibold.toString(),
    },
    colorBlocks_content: {
        flexGrow: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 48px",
    },
    colorBlocks_example: {
        height: "60px",
        display: "flex",
        alignItems: "center",
        marginTop: "24px",
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

function NeutralFillSwatch(
    props: Omit<SwatchTwoProps, "type" | "foregroundRecipe">
): JSX.Element {
    return (
        <SwatchTwo
            {...props}
            type={SwatchTwoTypes.fill}
            foregroundRecipe={neutralForegroundRest}
        />
    );
}

function AccentFillSwatch(
    props: Omit<SwatchTwoProps, "type" | "foregroundRecipe">
): JSX.Element {
    return (
        <SwatchTwo
            {...props}
            type={SwatchTwoTypes.fill}
            foregroundRecipe={accentForegroundCut}
        />
    );
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

    private titleStyleOverrides: ComponentStyleSheet<
        CaptionClassNameContract,
        ColorsDesignSystem
    > = {
        caption: {
            margin: "20px 0 12px",
            color: neutralForegroundRest,
        },
    };

    private stealthButtonOverrides: ComponentStyleSheet<
        ButtonClassNameContract,
        ColorsDesignSystem
    > = {
        button: {},
    };

    private hintTextStyleOverries: ComponentStyleSheet<
        CaptionClassNameContract,
        ColorsDesignSystem
    > = {
        caption: {
            color: neutralForegroundHint,
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
                <Caption
                    className={this.props.managedClasses.colorBlocks_backgroundColor}
                    jssStyleSheet={{ caption: { color: neutralForegroundHintLarge } }}
                >
                    BACKGROUND {this.props.index} -{" "}
                    {this.state.designSystem.backgroundColor.toUpperCase()}
                </Caption>

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
        return (
            <React.Fragment>
                {this.renderExample(
                    <Button appearance={ButtonAppearance.primary}>Accent</Button>
                )}

                <AccentFillSwatch
                    fillRecipe={accentFillRest}
                    recipeName="accentFillRest"
                />
                <AccentFillSwatch
                    fillRecipe={accentFillHover}
                    recipeName="accentFillHover"
                />
                <AccentFillSwatch
                    fillRecipe={accentFillActive}
                    recipeName="accentFillActive"
                />
                <AccentFillSwatch
                    fillRecipe={accentFillSelected}
                    recipeName="accentFillSelected"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={accentFillRest}
                    foregroundRecipe={accentForegroundCut}
                    recipeName="accentForegroundCut"
                />
            </React.Fragment>
        );
    }
    private renderNeutralComponent(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderAccentComponent()}
                {this.renderExample(<Button>Neutral</Button>)}
                <NeutralFillSwatch
                    fillRecipe={neutralFillRest}
                    recipeName="neutralFillRest"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillHover}
                    recipeName="neutralFillHover"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillActive}
                    recipeName="neutralFillActive"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillSelected}
                    recipeName="neutralFillSelected"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />

                {this.renderGhostComponent()}
                {this.renderStealthComponent()}
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
                        beforeContent={StealthIcon}
                    >
                        Stealth
                    </Button>
                )}

                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthRest}
                    recipeName="neutralFillStealthRest"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthHover}
                    recipeName="neutralFillStealthHover"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthActive}
                    recipeName="neutralFillStealthActive"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthSelected}
                    recipeName="neutralFillStealthSelected"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
            </React.Fragment>
        );
    }

    private renderGhostComponent(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderExample(
                    <Button appearance={ButtonAppearance.outline}>Outline</Button>
                )}
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthRest}
                    recipeName="neutralFillStealthRest"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthHover}
                    recipeName="neutralFillStealthHover"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthActive}
                    recipeName="neutralFillStealthActive"
                />
                <NeutralFillSwatch
                    fillRecipe={neutralFillStealthSelected}
                    recipeName="neutralFillStealthSelected"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineRest}
                    recipeName="neutralOutlineRest"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineHover}
                    recipeName="neutralOutlineHover"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineActive}
                    recipeName="neutralOutlineActive"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
            </React.Fragment>
        );
        //         return (
        //             <React.Fragment>
        //                 {this.renderExample(
        //                     <Button appearance={ButtonAppearance.outline}>Ghost</Button>
        //                 )}
        //                 {this.renderExample(<TextField placeholder="jerry@microsoft.com" />)}
        //                 {this.renderExample(
        //                     <Checkbox inputId={uniqueId()}>
        //                         <label slot="label">Checkbox</label>
        //                     </Checkbox>
        //                 )}
        //
        //                 <Caption jssStyleSheet={this.titleStyleOverrides}>
        //                     NEUTRAL / FILL / STEALTH
        //                 </Caption>
        //                 <Swatch
        //                     color={backgroundColors.rest}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={textColor}
        //                     state={SwatchStates.rest}
        //                 />
        //                 <Swatch
        //                     color={backgroundColors.hover}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={textColor}
        //                     state={SwatchStates.hover}
        //                 />
        //                 <Swatch
        //                     color={backgroundColors.active}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={textColor}
        //                     state={SwatchStates.active}
        //                 />
        //                 <Swatch
        //                     color={backgroundColors.selected}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={neutralForegroundRest(() => backgroundColors.selected)(
        //                         {} as ColorsDesignSystem
        //                     )}
        //                     state={SwatchStates.selected}
        //                 />
        //                 <Caption jssStyleSheet={this.titleStyleOverrides}>
        //                     NEUTRAL / OUTLINE
        //                 </Caption>
        //                 <Swatch
        //                     color={borderColors.rest}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={neutralForegroundRest(
        //                         Object.assign({}, this.state.designSystem, {
        //                             backgroundColor: borderColors.hover,
        //                         })
        //                     )}
        //                     state={SwatchStates.rest}
        //                     showTextContrast={false}
        //                     showBackgroundContrast={false}
        //                 />
        //                 <Swatch
        //                     color={borderColors.hover}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={neutralForegroundRest(
        //                         Object.assign({}, this.state.designSystem, {
        //                             backgroundColor: borderColors.hover,
        //                         })
        //                     )}
        //                     state={SwatchStates.hover}
        //                     showTextContrast={false}
        //                     showBackgroundContrast={false}
        //                 />
        //                 <Swatch
        //                     color={borderColors.active}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     textColor={neutralForegroundRest(
        //                         Object.assign({}, this.state.designSystem, {
        //                             backgroundColor: borderColors.active,
        //                         })
        //                     )}
        //                     state={SwatchStates.active}
        //                     showTextContrast={false}
        //                     showBackgroundContrast={false}
        //                 />
        //                 <Caption jssStyleSheet={this.titleStyleOverrides}>
        //                     NEUTRAL / FOREGROUND
        //                 </Caption>
        //                 <Swatch
        //                     color={textColor}
        //                     backgroundColor={this.state.designSystem.backgroundColor}
        //                     showTextContrast={false}
        //                     showBackgroundContrast={false}
        //                     textColor={neutralForegroundRest(
        //                         Object.assign({}, this.state.designSystem, {
        //                             backgroundColor: textColor,
        //                         })
        //                     )}
        //                 />
        //             </React.Fragment>
        //         );
    }

    private renderTextComponent(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderExample(<Paragraph>Neutral</Paragraph>)}
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />

                {this.renderExample(
                    <Caption jssStyleSheet={this.hintTextStyleOverries}>Hint</Caption>
                )}
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundHint}
                    recipeName="neutralForegroundHint"
                />

                {this.renderExample(<Hypertext href={"#"}>Accent</Hypertext>)}

                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={accentForegroundRest}
                    recipeName="accentForegroundRest"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={accentForegroundHover}
                    recipeName="accentForegroundHover"
                />
                <SwatchTwo
                    type={SwatchTwoTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={accentForegroundActive}
                    recipeName="accentForegroundActive"
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
