import {
    Background,
    Button,
    ButtonAppearance,
    Caption,
    CaptionClassNameContract,
    Checkbox,
    Divider,
    Hypertext,
    Label,
    Paragraph,
    ParagraphClassNameContract,
    TextField,
} from "@microsoft/fast-components-react-msft";
import React from "react";
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
    neutralDividerRest,
    neutralFillActive,
    neutralFillHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralFillSelected,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFillToggleActive,
    neutralFillToggleHover,
    neutralFillToggleRest,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForegroundActive,
    neutralForegroundHint,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineContrastActive,
    neutralOutlineContrastHover,
    neutralOutlineContrastRest,
    neutralOutlineHover,
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import classnames from "classnames";
import { get, isEqual, uniqueId } from "lodash-es";
import { DividerClassNameContract } from "@microsoft/fast-components-react-base";
import { connect } from "react-redux";
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
        margin: "16px auto 4px",
        fontWeight: fontWeight.semibold.toString(),
        height: "34px",
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

    title?: string;
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
    props: Omit<SwatchProps, "type" | "fillRecipe" | "foregroundRecipe" | "recipeName">
): JSX.Element {
    return (
        <Swatch
            {...props}
            type={SwatchTypes.outline}
            fillRecipe={backgroundColor}
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

    private neutralTextStyleOverrides: ComponentStyleSheet<
        ParagraphClassNameContract,
        ColorsDesignSystem
    > = {
        paragraph: {
            "&:hover": {
                color: neutralForegroundHover,
            },
            "&:active": {
                color: neutralForegroundActive,
            },
        },
    };

    private hintTextStyleOverrides: ComponentStyleSheet<
        CaptionClassNameContract,
        ColorsDesignSystem
    > = {
        caption: {
            color: neutralForegroundHint,
        },
    };

    private dividerStyleOverrides: ComponentStyleSheet<
        DividerClassNameContract,
        ColorsDesignSystem
    > = {
        divider: {
            width: "150px",
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
                    className={this.props.managedClasses.colorBlocks_title}
                    jssStyleSheet={{ caption: { color: neutralForegroundHint } }}
                >
                    BACKGROUND {this.props.index} -{" "}
                    {this.state.designSystem.backgroundColor.toUpperCase()}
                    {this.props.title ? <br /> : null}
                    {this.props.title ? (
                        <code style={{ fontWeight: "normal" }}>{this.props.title}</code>
                    ) : null}
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
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={neutralFocus}
                    foregroundRecipe={neutralFocusInnerAccent(accentFillRest)}
                    outlineRecipe={neutralFocusInnerAccent(accentFillRest)}
                    recipeName="neutralFocusInnerAccent"
                />
                <FocusSwatch />

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
                <FocusSwatch />

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
                <FocusSwatch />

                {/* Outline component */}
                {this.renderExample(
                    <Button
                        appearance={ButtonAppearance.stealth}
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
                <FocusSwatch />
            </React.Fragment>
        );
    }

    private renderTextComponents(): React.ReactNode {
        return (
            <React.Fragment>
                {this.renderExample(
                    <Paragraph jssStyleSheet={this.neutralTextStyleOverrides}>
                        Neutral
                    </Paragraph>
                )}
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    recipeName="neutralForegroundRest"
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundHover}
                    recipeName="neutralForegroundHover"
                />
                <Swatch
                    type={SwatchTypes.foreground}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundActive}
                    recipeName="neutralForegroundActive"
                />

                {this.renderExample(
                    <Caption jssStyleSheet={this.hintTextStyleOverrides}>Hint</Caption>
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
                <FocusSwatch />
            </React.Fragment>
        );
    }

    private renderFormComponents(): React.ReactNode {
        const checkboxId: string = uniqueId();
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
                <FocusSwatch />
                {this.renderExample(
                    <Checkbox inputId={checkboxId}>
                        <Label slot="label" htmlFor={checkboxId}>
                            Checkbox
                        </Label>
                    </Checkbox>
                )}
                <Swatch
                    type={SwatchTypes.fill}
                    fillRecipe={neutralFillInputRest}
                    recipeName="neutralFillInputRest"
                    foregroundRecipe={neutralForegroundRest}
                />
                <Swatch
                    type={SwatchTypes.fill}
                    fillRecipe={neutralFillToggleRest}
                    recipeName="neutralFillToggleRest"
                    foregroundRecipe={neutralForegroundRest}
                />
                <Swatch
                    type={SwatchTypes.fill}
                    fillRecipe={neutralFillToggleHover}
                    recipeName="neutralFillToggleHover"
                    foregroundRecipe={neutralForegroundRest}
                />
                <Swatch
                    type={SwatchTypes.fill}
                    fillRecipe={neutralFillToggleActive}
                    recipeName="neutralFillToggleActive"
                    foregroundRecipe={neutralForegroundRest}
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
                    outlineRecipe={neutralOutlineContrastRest}
                    recipeName="neutralOutlineContrastRest"
                />
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineContrastHover}
                    recipeName="neutralOutlineContrastHover"
                />
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralOutlineContrastActive}
                    recipeName="neutralOutlineContrastActive"
                />
                <FocusSwatch />
                {this.renderExample(
                    <Divider jssStyleSheet={this.dividerStyleOverrides} />
                )}
                <Swatch
                    type={SwatchTypes.outline}
                    fillRecipe={backgroundColor}
                    foregroundRecipe={neutralForegroundRest}
                    outlineRecipe={neutralDividerRest}
                    recipeName="neutralDividerRest"
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(
    state: AppState
): Pick<ColorBlocksProps, "component" | "designSystem"> {
    return {
        component: state.componentType,
        designSystem: state.designSystem,
    };
}

export default manageJss(styles)(connect(mapStateToProps)(ColorBlocksBase));
