import React from "react";
import { CSSRefProps, CSSRefState } from "./control.css-ref.props";
import {
    CombinatorType,
    CSSPropertiesDictionary,
    CSSPropertyRef,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { renderTypeControl } from "./control.css.utilities.type";
import { renderSyntaxControl } from "./control.css.utilities.syntax";
import { renderValueControl } from "./control.css.utilities.value";
import { renderPropertyControl } from "./control.css.utilities.property";
import { properties } from "@microsoft/fast-tooling/dist/esm/css-data";
import { renderSelection } from "./control.css.utilities";

/**
 * Custom CSS reference definition
 */
export class CSSRef extends React.Component<CSSRefProps, CSSRefState> {
    constructor(props: CSSRefProps) {
        super(props);

        this.state = {
            index: null,
            values: [],
        };
    }

    public render(): React.ReactNode {
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

    private renderMultipleItems(): React.ReactNode {
        return (
            <div>
                {(this.props.syntax.ref as CSSPropertyRef[]).map(
                    (syntaxRef: CSSPropertyRef, index: number) => {
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
                    }
                )}
            </div>
        );
    }

    private renderExactlyOne(): React.ReactNode {
        const cssRef: React.ReactNode =
            this.state.index !== null &&
            (this.props.syntax.ref as CSSPropertyRef[])[this.state.index] &&
            (this.props.syntax.ref as CSSPropertyRef[])[this.state.index].type !==
                "value" ? (
                <CSSRef
                    syntax={(this.props.syntax.ref as CSSPropertyRef[])[this.state.index]}
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
                        ...(this.props.syntax.ref as CSSPropertyRef[]).map(
                            (refItem: CSSPropertyRef, index: number) => {
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
                            }
                        ),
                    ],
                    value: this.props.value,
                    dictionaryId: this.props.dictionaryId,
                    dataLocation: this.props.dataLocation,
                })}
                {cssRef}
            </div>
        );
    }

    private renderByType(): React.ReactNode {
        if (typeof this.props.syntax.ref === "string") {
            switch ((this.props.syntax as CSSPropertyRef).type) {
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
                    const propertyKey: string = this.props.syntax.ref.slice(2, -2);

                    if (
                        ((properties as unknown) as CSSPropertiesDictionary)[
                            propertyKey
                        ] !== undefined
                    ) {
                        return renderPropertyControl({
                            syntax: ((properties as unknown) as CSSPropertiesDictionary)[
                                propertyKey
                            ].syntax,
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

    private renderBrackets(): React.ReactNode {
        return null;
    }

    private handleFormElementOnChange = (value: string): void => {
        if (
            (this.props.syntax.ref as CSSPropertyRef[])[value] &&
            (this.props.syntax.ref as CSSPropertyRef[])[value].type === "value"
        ) {
            const index: number = parseInt(value, 10);
            const updatedValues: string[] = [this.props.syntax.ref[value].ref];

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

    private handleChange = (value: string): void => {
        const updatedValues: string[] = this.state.values.concat([]);
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

    private handleMultipleChange = (index: number): ((value: string) => void) => {
        return (value: string) => {
            const updatedValues: string[] = this.state.values.concat([]);
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
}
