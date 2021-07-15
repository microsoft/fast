import { get, values } from "lodash-es";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import manageJss from "@microsoft/fast-jss-manager-react";
import { format } from "@microsoft/fast-jss-utilities";
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
import { height } from "@microsoft/fast-components-styles-msft";
import {
    AccentColors,
    defaultAccentColor,
    defaultNeutralColor,
    neutralColors,
} from "./colors";
import { bridge } from "./design-system";
import {
    backgroundColor,
    focusStrokeOuter,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralStrokeDividerRest,
    neutralStrokeRest,
} from "./recipes";
import {
    ComponentTypes,
    setAccentBaseColor,
    setComponentType,
    setNeutralBaseColor,
    setShowOnlyRecommendedBackgrounds,
} from "./state";
const accentShortcuts = values(AccentColors);
const styles = {
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
                            borderRadius: "3px !important",
                        },
                    },
                },
            },
        },
        ".sketch-picker input": {
            boxShadow: "none !important",
            background: neutralFillInputRest,
            color: neutralForegroundRest,
            border: format("1px solid {0} !important", neutralStrokeRest),
            height: bridge(height()),
            fontSize: "14px !important",
            borderRadius: "3px !important",
            paddingTop: "0 !important",
            paddingBottom: "0 !important",
            "&:focus": {
                outline: "none",
                boxShadow: format("0 0 0 2px {0} inset !important", focusStrokeOuter),
            },
        },
        ".sketch-picker .flexbox-fix span": {
            color: format("{0} !important", neutralForegroundRest),
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
        borderLeft: format("1px solid {0}", neutralStrokeDividerRest),
        background: backgroundColor,
        overflow: "auto",
    },
};
function titleCase(str) {
    return str.split("").reduce((accumulated, value, index) => {
        return accumulated.concat(index === 0 ? value.toUpperCase() : value);
    }, "");
}
class ControlPaneBase extends React.Component {
    constructor(props) {
        super(props);
        this.labelStyles = {
            marginBottom: "8px",
        };
        this.inputStyles = {
            marginBottom: "18px",
            width: "100%",
        };
        this.generateComponentSelectionRadio = type => {
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
        this.handleComponentValueChange = e => {
            this.props.setComponentType(e.target.value);
        };
        this.handleRecommendedBackgroundsChange = e => {
            this.props.setShowOnlyRecommendedBackgrounds(
                !this.props.showOnlyRecommendedBackgrounds
            );
        };
        this.state = {
            accentColorBase: defaultAccentColor,
            neutralColorBase: defaultNeutralColor,
        };
    }
    render() {
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
    handleFormSubmit(e) {
        e.preventDefault();
    }
    renderComponentSelector() {
        const items = Object.keys(ComponentTypes).map(key => {
            return <SelectOption id={key} value={key} displayString={key} key={key} />;
        });
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
    renderAccentBaseColorInput() {
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
    renderNeutralBaseColorInput() {
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
    renderColorShortcuts(colorValues, stateKey, callback) {
        const items = Object.keys(colorValues).map(colorName => {
            const onClick = e => {
                const color = parseColorHexRGB(colorValues[colorName]);
                if (color instanceof ColorRGBA64) {
                    callback(color);
                }
                this.setState({
                    [stateKey]: colorValues[colorName],
                });
            };
            const className = classnames(
                get(this.props.managedClasses, "controlPane_accentShortcut"),
                {
                    [get(
                        this.props.managedClasses,
                        "controlPane_accentShortcut__selected"
                    )]:
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
        });
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
    renderShowOnlyReccomendedBackgroundsInput() {
        const id = "showOnlyRecommendedBackgrounds";
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
    handleColorChange(palette, callback) {
        return newColor => {
            const color = parseColorHexRGB(newColor.hex);
            if (color instanceof ColorRGBA64 && typeof callback === "function") {
                callback(color);
            }
            this.setState({
                [palette]: newColor.hex,
            });
        };
    }
}
function mapStateToProps(state) {
    return state;
}
const ControlPane = connect(mapStateToProps, {
    setComponentType,
    setNeutralBaseColor,
    setAccentBaseColor,
    setShowOnlyRecommendedBackgrounds,
})(manageJss(styles)(ControlPaneBase));
export { ControlPane };
