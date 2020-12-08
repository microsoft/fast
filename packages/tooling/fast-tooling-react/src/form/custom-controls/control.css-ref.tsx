/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */

import React from "react";
import { CSSRefProps, CSSRefState } from "./control.css-ref.props";
import { Syntax } from "@microsoft/fast-tooling/dist/css-data.syntax";
import { Type } from "@microsoft/fast-tooling/dist/css-data.types";
import {
    CombinatorType,
    CSSPropertiesDictionary,
    CSSPropertyRef,
} from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";
import { renderTypeControl } from "./control.css.utilities.type";
import { renderSyntaxControl } from "./control.css.utilities.syntax";
import { renderValueControl } from "./control.css.utilities.value";
import { renderPropertyControl } from "./control.css.utilities.property";
import { properties } from "@microsoft/fast-tooling/dist/css-data";

/**
 * Custom CSS reference definition
 */
export class CSSRef extends React.Component<CSSRefProps, CSSRefState> {
    constructor(props: CSSRefProps) {
        super(props);

        this.state = {
            index: 0,
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
                            />
                        );
                    }
                )}
            </div>
        );
    }

    private renderExactlyOne(): React.ReactNode {
        const cssRef: React.ReactNode =
            this.state.index !== undefined &&
            (this.props.syntax.ref as CSSPropertyRef[])[this.state.index] &&
            (this.props.syntax.ref as CSSPropertyRef[])[this.state.index].type !==
                "value" ? (
                <CSSRef
                    syntax={(this.props.syntax.ref as CSSPropertyRef[])[this.state.index]}
                    onChange={this.handleChange}
                />
            ) : null;

        return (
            <div>
                <select onChange={this.handleFormElementOnChange}>
                    <option key={"init"} value={void 0}></option>
                    {(this.props.syntax.ref as CSSPropertyRef[]).map(
                        (refItem: CSSPropertyRef, index: number) => {
                            if (typeof refItem.ref === "string") {
                                // This should always be a string, but check in case
                                return (
                                    <option key={index} value={index}>
                                        {refItem.ref}
                                    </option>
                                );
                            }

                            return (
                                <option key={index} value={index}>
                                    {refItem.type}
                                </option>
                            );
                        }
                    )}
                </select>
                {cssRef}
            </div>
        );
    }

    private renderByType(): React.ReactNode {
        if (typeof this.props.syntax.ref === "string") {
            switch (this.props.syntax.type) {
                case "value":
                    return renderValueControl({
                        ref: this.props.syntax,
                        key: this.props.syntax.ref,
                        handleChange: this.props.onChange,
                    });
                case "type":
                    return renderTypeControl({
                        type: this.props.syntax.ref as Type,
                        key: this.props.syntax.ref,
                        handleChange: this.props.onChange,
                    });
                case "syntax":
                    return renderSyntaxControl({
                        syntax: this.props.syntax.ref as Syntax,
                        key: this.props.syntax.ref,
                        handleChange: this.props.onChange,
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
                        });
                    }
                default:
                    return null;
            }
        }

        return <CSSRef syntax={this.props.syntax.ref[0]} onChange={this.handleChange} />;
    }

    private renderBrackets(): React.ReactNode {
        return null;
    }

    private handleFormElementOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        if (
            (this.props.syntax.ref as CSSPropertyRef[])[e.currentTarget.value] &&
            (this.props.syntax.ref as CSSPropertyRef[])[e.currentTarget.value].type ===
                "value"
        ) {
            const index: number = parseInt(e.currentTarget.value, 10);
            const updatedValues: string[] = [
                this.props.syntax.ref[e.currentTarget.value].ref,
            ];

            this.setState(
                {
                    index,
                    values: updatedValues,
                },
                () => {
                    this.props.onChange(this.state.values[0]);
                }
            );
        } else if (e.currentTarget.value === "") {
            this.setState(
                {
                    index: 0,
                    values: [],
                },
                () => {
                    this.props.onChange(this.state.values[0]);
                }
            );
        } else {
            this.setState(
                {
                    index: parseInt(e.currentTarget.value, 10),
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
