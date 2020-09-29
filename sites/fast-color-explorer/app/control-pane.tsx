import { get, values } from "lodash-es";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    backgroundColor,
    cornerRadius,
    elevation,
    ElevationMultiplier,
    height,
    neutralDividerRest,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, {
    ComponentStyleSheet,
    DesignSystem,
    ManagedClasses,
} from "@microsoft/fast-jss-manager-react";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { Pane } from "@microsoft/fast-layouts-react";
import classnames from "classnames";
import {
    Checkbox,
    Heading,
    HeadingSize,
    HeadingTag,
    Label,
    Radio,
    RadioSlot,
    SelectOption,
} from "@microsoft/fast-components-react-msft";
import React from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import {
    AccentColors,
    defaultAccentColor,
    defaultNeutralColor,
    neutralColors,
} from "./colors";
import { ColorsDesignSystem } from "./design-system";
import {
    AppState,
    ComponentTypes,
    setAccentBaseColor,
    setComponentType,
    setNeutralBaseColor,
    setShowOnlyRecommendedBackgrounds,
} from "./state";

export interface ControlPaneClassNameContract {
    controlPane: string;
    controlPane_accentShortcutContainer: string;
    controlPane_accentShortcut: string;
    controlPane_accentShortcut__selected: string;
}

export interface ControlPaneProps extends ManagedClasses<ControlPaneClassNameContract> {
    componentType: ComponentTypes;
    designSystem: ColorsDesignSystem;
    setComponentType: (value: string) => any;
    setNeutralBaseColor: (value: ColorRGBA64) => any;
    setAccentBaseColor: (value: ColorRGBA64) => any;
    setShowOnlyRecommendedBackgrounds: (value: boolean) => any;
    showOnlyRecommendedBackgrounds: boolean;
}

export interface ControlPaneState {
    accentColorBase: string;
    neutralColorBase: string;
}

const accentShortcuts: string[] = values(AccentColors);

const styles: any = (
    designSystem: ColorsDesignSystem
): ComponentStyleSheet<any, ColorsDesignSystem> => {
    return {
        "@global": {
            body: {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: "14px",
                margin: "0",
            },
            ".sketch-picker": {
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box !important",
                width: "100% !important",
                background: "transparent !important",
                boxShadow: "none !important",
                "& > div": {
                    "&:nth-child(1)": {
                        order: "2",
                    },
                    "&:nth-child(2)": {
                        display: "none !important",
                    },
                    "&:nth-child(3)": {
                        order: "4",
                        paddingBottom: "4px",
                    },
                    "&:nth-child(4)": {
                        borderTop: "none !important",
                        paddingTop: "0 !important",
                        "& div": {
                            width: "24px !important",
                            height: "24px !important",
                            "& div": {
                                borderRadius: format(
                                    "{0} !important",
                                    toPx(cornerRadius)
                                )(designSystem),
                            },
                        },
                    },
                },
            },
            ".sketch-picker input": {
                boxShadow: "none !important",
                background: neutralFillInputRest(designSystem),
                color: neutralForegroundRest(designSystem),
                border: `1px solid ${neutralOutlineRest(designSystem)} !important`,
                height: height()(designSystem),
                fontSize: "14px !important",
                borderRadius: format("{0} !important", toPx(cornerRadius))(designSystem),
                paddingTop: "0 !important",
                paddingBottom: "0 !important",
                "&:focus": {
                    outline: "none",
                    boxShadow: `0 0 0 2px ${neutralFocus(designSystem)} inset !important`,
                },
            },
            ".sketch-picker .flexbox-fix span": {
                color: `${neutralForegroundRest(designSystem)} !important`,
            },
        },
        controlPane: {
            position: "relative",
            zIndex: "1",
            padding: "12px",
            boxSizing: "border-box",
            color: neutralForegroundRest,
            height: "100%",
            maxWidth: "300px",
            borderLeft: `1px solid ${neutralDividerRest(designSystem)}`,
            background: backgroundColor,
            overflow: "auto",
        },
    };
};

function titleCase(str: string): string {
    return str
        .split("")
        .reduce((accumulated: string, value: string, index: number): string => {
            return accumulated.concat(index === 0 ? value.toUpperCase() : value);
        }, "");
}
class ControlPaneBase extends React.Component<ControlPaneProps, ControlPaneState> {
    private labelStyles: React.CSSProperties = {
        marginBottom: "8px",
    };

    private inputStyles: React.CSSProperties = {
        marginBottom: "18px",
        width: "100%",
    };

    constructor(props: ControlPaneProps) {
        super(props);

        this.state = {
            accentColorBase: defaultAccentColor,
            neutralColorBase: defaultNeutralColor,
        };
    }

    public render(): React.ReactNode {
        return (
            <Pane className={get(this.props.managedClasses, "controlPane", "")}>
                <form onSubmit={this.handleFormSubmit}>
                    <Heading
                        size={HeadingSize._5}
                        tag={HeadingTag.h2}
                        style={this.labelStyles}
                    >
                        Settings
                    </Heading>
                    {this.renderComponentSelector()}
                    {this.renderNeutralBaseColorInput()}
                    {this.renderShowOnlyReccomendedBackgroundsInput()}
                    {this.renderAccentBaseColorInput()}
                    <div
                        className={get(
                            this.props.managedClasses,
                            "controlPane_accentShortcutContainer"
                        )}
                    />
                </form>
            </Pane>
        );
    }

    private handleFormSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
    }

    private generateComponentSelectionRadio = (type: ComponentTypes): JSX.Element => {
        return (
            <div key={type}>
                <Radio
                    inputId={type}
                    checked={type === this.props.componentType}
                    name="component"
                    onChange={this.handleComponentValueChange}
                    value={type}
                >
                    <Label htmlFor={type} slot={RadioSlot.label}>
                        {titleCase(type)}
                    </Label>
                </Radio>
            </div>
        );
    };

    private renderComponentSelector(): JSX.Element {
        const items: JSX.Element[] = Object.keys(ComponentTypes).map(
            (key: string): JSX.Element => {
                return (
                    <SelectOption id={key} value={key} displayString={key} key={key} />
                );
            }
        );

        return (
            <React.Fragment>
                <Label style={this.labelStyles}>Component type</Label>
                <div style={{ marginBottom: "12px" }}>
                    {Object.keys(ComponentTypes).map(
                        this.generateComponentSelectionRadio
                    )}
                </div>
            </React.Fragment>
        );
    }

    private handleComponentValueChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.props.setComponentType(e.target.value);
    };

    private renderAccentBaseColorInput(): JSX.Element {
        return (
            <React.Fragment>
                <Label style={this.labelStyles}>Accent base color</Label>
                <SketchPicker
                    color={this.state.accentColorBase}
                    onChange={this.handleColorChange(
                        "accentColorBase",
                        this.props.setAccentBaseColor
                    )}
                    disableAlpha={true}
                    presetColors={accentShortcuts}
                />
            </React.Fragment>
        );
    }

    private renderNeutralBaseColorInput(): JSX.Element {
        return (
            <React.Fragment>
                <Label style={this.labelStyles}>Neutral base color</Label>
                <SketchPicker
                    color={this.state.neutralColorBase}
                    onChange={this.handleColorChange(
                        "neutralColorBase",
                        this.props.setNeutralBaseColor
                    )}
                    disableAlpha={true}
                    presetColors={neutralColors}
                />
            </React.Fragment>
        );
    }

    private renderColorShortcuts(
        colorValues: any,
        stateKey: keyof ControlPaneState,
        callback: (value: ColorRGBA64) => void
    ): JSX.Element {
        const items: JSX.Element[] = Object.keys(colorValues).map(
            (colorName: string): JSX.Element => {
                const onClick: React.MouseEventHandler = (
                    e: React.MouseEvent<HTMLButtonElement>
                ): void => {
                    const color: ColorRGBA64 | null = parseColorHexRGB(
                        colorValues[colorName]
                    );
                    if (color instanceof ColorRGBA64) {
                        callback(color);
                    }

                    this.setState({
                        [stateKey]: colorValues[colorName],
                    } as any);
                };

                const className: string = classnames(
                    get(this.props.managedClasses, "controlPane_accentShortcut"),
                    {
                        [get(
                            this.props.managedClasses,
                            "controlPane_accentShortcut__selected"
                        ) as string]:
                            this.state[stateKey].toLowerCase() ===
                            colorValues[colorName].toLowerCase(),
                    }
                );

                return (
                    <button
                        className={className}
                        style={{ backgroundColor: colorValues[colorName] }}
                        onClick={onClick}
                        key={colorName}
                        aria-label={colorName}
                    />
                );
            }
        );

        return (
            <div
                className={get(
                    this.props.managedClasses,
                    "controlPane_accentShortcutContainer"
                )}
            >
                {items}
            </div>
        );
    }

    private renderShowOnlyReccomendedBackgroundsInput(): JSX.Element {
        const id: string = "showOnlyRecommendedBackgrounds";
        return (
            <React.Fragment>
                <div style={{ marginBottom: "12px" }}>
                    <Checkbox
                        checked={this.props.showOnlyRecommendedBackgrounds}
                        inputId={id}
                        onChange={this.handleRecommendedBackgroundsChange}
                    >
                        <Label slot="label" htmlFor={id}>
                            Show recommended backgrounds only
                        </Label>
                    </Checkbox>
                </div>
            </React.Fragment>
        );
    }

    private handleRecommendedBackgroundsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.props.setShowOnlyRecommendedBackgrounds(
            !this.props.showOnlyRecommendedBackgrounds
        );
    };

    private handleColorChange(
        palette: "neutralColorBase" | "accentColorBase",
        callback: (color: ColorRGBA64) => void
    ): (color: { hex: string }) => void {
        return (newColor: { hex: string }): void => {
            const color: ColorRGBA64 | null = parseColorHexRGB(newColor.hex);

            if (color instanceof ColorRGBA64 && typeof callback === "function") {
                callback(color);
            }

            this.setState({
                [palette]: newColor.hex,
            } as any);
        };
    }
}

function mapStateToProps(state: AppState): AppState {
    return state;
}

const ControlPane = connect(mapStateToProps, {
    setComponentType,
    setNeutralBaseColor,
    setAccentBaseColor,
    setShowOnlyRecommendedBackgrounds,
})(manageJss(styles)(ControlPaneBase));
type ControlPane = InstanceType<typeof ControlPane>;
export { ControlPane };
