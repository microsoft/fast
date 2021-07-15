import React from "react";
import { CombinatorType } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { renderTypeControl } from "./control.css.utilities.type";
import { renderSyntaxControl } from "./control.css.utilities.syntax";
import { renderValueControl } from "./control.css.utilities.value";
import { renderPropertyControl } from "./control.css.utilities.property";
import { properties } from "@microsoft/fast-tooling/dist/esm/css-data";
import { renderSelection } from "./control.css.utilities";
/**
 * Custom CSS reference definition
 */
export class CSSRef extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormElementOnChange = value => {
            if (
                this.props.syntax.ref[value] &&
                this.props.syntax.ref[value].type === "value"
            ) {
                const index = parseInt(value, 10);
                const updatedValues = [this.props.syntax.ref[value].ref];
                this.setState(
                    {
                        index,
                        values: updatedValues,
                    },
                    () => {
                        this.props.onChange(this.state.values[0]);
                    }
                );
            } else if (value === "") {
                this.setState(
                    {
                        index: null,
                        values: [],
                    },
                    () => {
                        this.props.onChange(this.state.values[0]);
                    }
                );
            } else {
                this.setState(
                    {
                        index: parseInt(value, 10),
                        values: [],
                    },
                    () => {
                        this.props.onChange(this.state.values[0]);
                    }
                );
            }
        };
        this.handleChange = value => {
            const updatedValues = this.state.values.concat([]);
            updatedValues[0] = value;
            this.setState(
                {
                    values: updatedValues,
                },
                () => {
                    this.props.onChange(this.state.values.join(" ").trim());
                }
            );
        };
        this.handleMultipleChange = index => {
            return value => {
                const updatedValues = this.state.values.concat([]);
                updatedValues[index] = value;
                this.setState(
                    {
                        values: updatedValues,
                    },
                    () => {
                        this.props.onChange(this.state.values.join(" ").trim());
                    }
                );
            };
        };
        this.state = {
            index: null,
            values: [],
        };
    }
    render() {
        switch (this.props.syntax.refCombinatorType) {
            case CombinatorType.juxtaposition:
            case CombinatorType.mandatoryInAnyOrder:
            case CombinatorType.atLeastOneInAnyOrder:
                return this.renderMultipleItems();
            case CombinatorType.brackets:
                return this.renderBrackets();
            case CombinatorType.exactlyOne:
                return this.renderExactlyOne();
            default:
                return this.renderByType();
        }
    }
    renderMultipleItems() {
        return (
            <div>
                {this.props.syntax.ref.map((syntaxRef, index) => {
                    return (
                        <CSSRef
                            key={index}
                            syntax={syntaxRef}
                            onChange={this.handleMultipleChange(index)}
                            value={this.state.values[index]}
                            dictionaryId={this.props.dictionaryId}
                            dataLocation={this.props.dataLocation}
                        />
                    );
                })}
            </div>
        );
    }
    renderExactlyOne() {
        const cssRef =
            this.state.index !== null &&
            this.props.syntax.ref[this.state.index] &&
            this.props.syntax.ref[this.state.index].type !== "value" ? (
                <CSSRef
                    syntax={this.props.syntax.ref[this.state.index]}
                    onChange={this.handleChange}
                    value={this.state.values[this.state.index]}
                    dictionaryId={this.props.dictionaryId}
                    dataLocation={this.props.dataLocation}
                />
            ) : null;
        return (
            <div>
                {renderSelection({
                    key: `${this.state.index}`,
                    handleChange: this.handleFormElementOnChange,
                    options: [
                        {
                            key: "init",
                            value: "",
                            displayName: "",
                        },
                        ...this.props.syntax.ref.map((refItem, index) => {
                            if (typeof refItem.ref === "string") {
                                // This should always be a string, but check in case
                                return {
                                    key: `${index}`,
                                    value: index,
                                    displayName: refItem.ref,
                                };
                            }
                            return {
                                key: `${index}`,
                                value: index,
                                displayName: refItem.type,
                            };
                        }),
                    ],
                    value: this.props.value,
                    dictionaryId: this.props.dictionaryId,
                    dataLocation: this.props.dataLocation,
                })}
                {cssRef}
            </div>
        );
    }
    renderByType() {
        if (typeof this.props.syntax.ref === "string") {
            switch (this.props.syntax.type) {
                case "value":
                    return renderValueControl({
                        ref: this.props.syntax,
                        key: this.props.syntax.ref,
                        handleChange: this.props.onChange,
                        value: this.props.value,
                        dictionaryId: this.props.dictionaryId,
                        dataLocation: this.props.dataLocation,
                    });
                case "type":
                    return renderTypeControl({
                        ref: this.props.syntax,
                        key: this.props.syntax.ref,
                        handleChange: this.props.onChange,
                        value: this.props.value,
                        dictionaryId: this.props.dictionaryId,
                        dataLocation: this.props.dataLocation,
                    });
                case "syntax":
                    return renderSyntaxControl({
                        ref: this.props.syntax,
                        key: this.props.syntax.ref,
                        handleChange: this.props.onChange,
                        value: this.props.value,
                        dictionaryId: this.props.dictionaryId,
                        dataLocation: this.props.dataLocation,
                    });
                case "property":
                    const propertyKey = this.props.syntax.ref.slice(2, -2);
                    if (properties[propertyKey] !== undefined) {
                        return renderPropertyControl({
                            syntax: properties[propertyKey].syntax,
                            property: propertyKey,
                            key: this.props.syntax.ref,
                            handleChange: this.props.onChange,
                            value: this.props.value,
                            dictionaryId: this.props.dictionaryId,
                            dataLocation: this.props.dataLocation,
                        });
                    }
                default:
                    return null;
            }
        }
        return (
            <CSSRef
                syntax={this.props.syntax.ref[0]}
                onChange={this.handleChange}
                value={this.props.value}
                dictionaryId={this.props.dictionaryId}
                dataLocation={this.props.dataLocation}
            />
        );
    }
    renderBrackets() {
        return null;
    }
}
