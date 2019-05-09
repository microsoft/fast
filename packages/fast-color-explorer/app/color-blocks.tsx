import { ButtonClassNameContract } from "@microsoft/fast-components-react-base";
import {
    Background,
    Button,
    ButtonAppearance,
    Caption,
    CaptionClassNameContract,
    Hypertext,
    Paragraph,
    TextField,
} from "@microsoft/fast-components-react-msft";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentFillSelected,
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    backgroundColor,
    fontWeight,
    neutralFillActive,
    neutralFillHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralFillSelected,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import classnames from "classnames";
import { get, isEqual } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Omit } from "utility-types";
import { ColorsDesignSystem } from "./design-system";
import { StealthIcon } from "./icons";
import { AppState, ComponentTypes } from "./state";
import { Swatch, SwatchProps, SwatchTypes } from "./swatch";

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
        padding: "0 48px 36px",
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
    props: Omit<SwatchProps, "type" | "foregroundRecipe">
): JSX.Element {
    return (
        <Swatch
            {...props}
            type={SwatchTypes.fill}
            foregroundRecipe={neutralForegroundRest}
        />
    );
}

function AccentFillSwatch(
    props: Omit<SwatchProps, "type" | "foregroundRecipe">
): JSX.Element {
    return (
        <Swatch
            {...props}
            type={SwatchTypes.fill}
            foregroundRecipe={accentForegroundCut}
        />
    );
}

function FocusSwatch(
    props: Omit<SwatchProps, "type" | "foregroundRecipe" | "recipeName">
): JSX.Element {
    return (
        <Swatch
            {...props}
            type={SwatchTypes.outline}
            foregroundRecipe={neutralFocus}
            outlineRecipe={neutralFocus}
            recipeName="neutralFocus"
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
            case ComponentTypes.backplate:
                return this.renderBackplateComponents();
            case ComponentTypes.text:
                return this.renderTextComponents();
            case ComponentTypes.form:
                return this.renderFormComponents();
        }
    }

    private renderBackplateComponents(): React.ReactNode {
        return (
            <React.Fragment>
                {/* Accent component */}
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
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={accentFillRest}
                    foregroundRecipe={accentForegroundCut}
                    recipeName="accentForegroundCut"
                />
                <FocusSwatch fillRecipe={accentFillRest} />

                {/* Neutral component */}
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
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
                <FocusSwatch fillRecipe={accentFillRest} />

                {/* Outline component */}
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
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineRest}
                    recipeName="neutralOutlineRest"
                />
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineHover}
                    recipeName="neutralOutlineHover"
                />
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineActive}
                    recipeName="neutralOutlineActive"
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
                <FocusSwatch fillRecipe={accentFillRest} />

                {/* Outline component */}
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
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
                <FocusSwatch fillRecipe={accentFillRest} />
            </React.Fragment>
        );
    }

    private renderTextComponents(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderExample(<Paragraph>Neutral</Paragraph>)}
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />

                {this.renderExample(
                    <Caption jssStyleSheet={this.hintTextStyleOverries}>Hint</Caption>
                )}
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundHint}
                    recipeName="neutralForegroundHint"
                />

                {this.renderExample(<Hypertext href={"#"}>Accent</Hypertext>)}

                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={accentForegroundRest}
                    recipeName="accentForegroundRest"
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={accentForegroundHover}
                    recipeName="accentForegroundHover"
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={accentForegroundActive}
                    recipeName="accentForegroundActive"
                />
                <FocusSwatch fillRecipe={accentFillRest} />
            </React.Fragment>
        );
    }

    private renderFormComponents(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderExample(<TextField placeholder="jerry@microsoft.com" />)}
                <Swatch
                    type={SwatchTypes.fill}
                    fillRecipe={neutralFillInputRest}
                    recipeName="neutralFillInputRest"
                    foregroundRecipe={neutralForegroundRest}
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={neutralFillInputRest}
                    foregroundRecipe={neutralForegroundHint}
                    recipeName="neutralForegroundHint"
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={neutralFillInputRest}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineRest}
                    recipeName="neutralOutlineRest"
                />
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineHover}
                    recipeName="neutralOutlineHover"
                />
                <FocusSwatch fillRecipe={accentFillRest} />
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
