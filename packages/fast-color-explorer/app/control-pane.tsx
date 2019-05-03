import { get, values } from "lodash-es";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    backgroundColor,
    cornerRadius,
    elevation,
    ElevationMultiplier,
    height,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, {
    ComponentStyleSheet,
    ManagedClasses,
} from "@microsoft/fast-jss-manager-react";
import { Pane } from "@microsoft/fast-layouts-react";
import classnames from "classnames";
import {
    Heading,
    HeadingSize,
    HeadingTag,
    Label,
    Select,
    SelectOption,
} from "@microsoft/fast-components-react-msft";
import React from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { ColorsDesignSystem } from "./design-system";
import {
    AppState,
    ComponentTypes,
    setAccentBaseColor,
    setComponentType,
    setNeutralBaseColor,
} from "./state";
import { format, toPx } from "@microsoft/fast-jss-utilities";

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
}

export interface ControlPaneState {
    accentColorBase: string;
    neutralColorBase: string;
}

export enum AccentColors {
    black = "#000000",
    white = "#FFFFFF",
    blue = "#0078D4",
    green = "#107C10",
    purple = "#5C2D91",
    orange = "#D83B01",
    yellow = "#F2C812",
}

const neutralShortcuts: string[] = [
    "#808080",
    "#73818C",
    "#718E71",
    "#7F738C",
    "#8C7A73",
    "#0078D4",
    "#107C10",
    "#5C2D91",
    "#D83B01",
];

const accentShortcuts: string[] = values(AccentColors);

const styles: any = (
    designSystem: ColorsDesignSystem
): ComponentStyleSheet<any, ColorsDesignSystem> => {
    return {
        "@global": {
            body: {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: "14px",
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
        },
        controlPane: {
            position: "relative",
            zIndex: "1",
            padding: "12px",
            boxSizing: "border-box",
            color: neutralForegroundRest,
            height: "100%",
            maxWidth: "300px",
            boxShadow: (config: ColorsDesignSystem): string => {
                return (elevation(ElevationMultiplier.e7)(undefined as any) as any)
                    .boxShadow;
            },
            background: backgroundColor,
        },
    };
};

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
        const defaultAccentBase: ColorRGBA64 | null = this.getBaseColor(
            this.props.designSystem.accentPalette
        );
        const defaultNeutralBase: ColorRGBA64 | null = this.getBaseColor(
            this.props.designSystem.neutralPalette
        );

        this.state = {
            accentColorBase:
                defaultAccentBase instanceof ColorRGBA64
                    ? defaultAccentBase.toStringHexRGB()
                    : AccentColors.blue,
            neutralColorBase:
                defaultNeutralBase instanceof ColorRGBA64
                    ? defaultNeutralBase.toStringHexRGB()
                    : neutralShortcuts[0],
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

    private getBaseColor(palette: string[]): ColorRGBA64 | null {
        return parseColorHexRGB(palette[Math.floor(palette.length / 2)]);
    }

    private handleFormSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
    }

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
                <Select
                    selectedItems={[this.props.componentType]}
                    onValueChange={this.handleComponentValueChange}
                    style={this.inputStyles}
                >
                    {items}
                </Select>
            </React.Fragment>
        );
    }

    private handleComponentValueChange = (newValue: string): void => {
        this.props.setComponentType(newValue);
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
                    presetColors={neutralShortcuts}
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
    private handleColorChange(
        palette: "neutralColorBase" | "accentColorBase",
        callback: (color: ColorRGBA64) => void
    ): (color: { hex: string }) => void {
        return (newColor: { hex: string }): void => {
            const color: ColorRGBA64 | null = parseColorHexRGB(newColor.hex);

            if (color instanceof ColorRGBA64) {
                callback(color);
            }

            this.setState({
                [palette]: newColor.hex,
            } as any);
        };
    }
}

function mapStateToProps(state: AppState): Partial<ControlPaneProps> {
    return state;
}

/* tslint:disable-next-line */
const ControlPane = connect(
    mapStateToProps,
    { setComponentType, setNeutralBaseColor, setAccentBaseColor }
)(manageJss(styles)(ControlPaneBase));
type ControlPane = InstanceType<typeof ControlPane>;
export { ControlPane };
