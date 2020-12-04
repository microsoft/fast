import React from "react";
import styles, { CSSControlClassNameContract } from "./control.css.style";
import { CSSControlProps, CSSControlState, PropertyState } from "./control.css.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { classNames } from "@microsoft/fast-web-utilities";
import { properties } from "@microsoft/fast-tooling/dist/css-data";
import { Property } from "@microsoft/fast-tooling/dist/css-data.properties";
import { Syntax } from "@microsoft/fast-tooling/dist/css-data.syntax";
import { Type } from "@microsoft/fast-tooling/dist/css-data.types";
import {
    CombinatorType,
    CSSProperty,
    CSSPropertiesDictionary,
    CSSPropertyRef,
    CSSPropertySyntax,
} from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";
import { XOR } from "@microsoft/fast-tooling/dist/data-utilities/type.utilities";
import { renderSyntaxControl } from "./control.css.utilities.syntax";
import { renderTypeControl } from "./control.css.utilities.type";
import {
    resolveCSSValue,
    renderDeclarationValue,
    RenderControlBaseConfig,
} from "./control.css.utilities";

/**
 * Custom form control definition
 */
class CSSControl extends React.Component<
    CSSControlProps & ManagedClasses<CSSControlClassNameContract>,
    CSSControlState
> {
    constructor(props: CSSControlProps & ManagedClasses<CSSControlClassNameContract>) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <div className={classNames(this.props.managedClasses.css)}>
                {this.renderCSSProperties()}
            </div>
        );
    }

    private renderCSSProperties(): React.ReactNode {
        return Object.entries((properties as unknown) as CSSPropertiesDictionary).map(
            ([cssPropertyName, cssProperty]: [string, CSSProperty]): React.ReactNode => {
                return this.renderCSSProperty(cssProperty, cssPropertyName);
            }
        );
    }

    private renderCSSProperty(
        cssProperty: CSSProperty,
        cssPropertyName: string
    ): React.ReactNode {
        if (!cssProperty || !cssProperty.name || !cssProperty.syntax) {
            return null;
        }

        return (
            <fieldset key={cssPropertyName}>
                <label>{cssProperty.name}</label>
                {this.renderPropertySyntax(cssProperty.syntax)}
            </fieldset>
        );
    }

    private renderPropertySyntax(cssPropertySyntax: CSSPropertySyntax): React.ReactNode {
        const onChangeSyntaxHandler = this.getRefOnChangeSyntaxSwitchHandler(
            cssPropertySyntax.mapsToProperty
        );
        const combinatorType: CombinatorType =
            properties[cssPropertySyntax.mapsToProperty].syntax.refCombinatorType;

        switch (combinatorType) {
            case CombinatorType.juxtaposition:
            case CombinatorType.mandatoryInAnyOrder:
            case CombinatorType.atLeastOneInAnyOrder:
                return this.renderMultipleItems(
                    cssPropertySyntax,
                    properties[cssPropertySyntax.mapsToProperty].syntax.refCombinatorType
                );
            case CombinatorType.exactlyOne:
            default:
                return this.renderChoiceOfItems(
                    cssPropertySyntax,
                    onChangeSyntaxHandler,
                    properties[cssPropertySyntax.mapsToProperty].syntax.refCombinatorType,
                    cssPropertySyntax.mapsToProperty
                );
        }
    }

    private renderMultipleItems(
        cssPropertySyntaxItem: CSSPropertySyntax,
        combinatorType: CombinatorType
    ): React.ReactNode {
        return (
            <div key={cssPropertySyntaxItem.mapsToProperty}>
                {this.renderPropertyFormElements(
                    cssPropertySyntaxItem.mapsToProperty,
                    combinatorType
                )}
            </div>
        );
    }

    private renderChoiceOfItems(
        cssPropertySyntaxItem: CSSPropertySyntax,
        onChangeSyntaxHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void,
        combinatorType: CombinatorType,
        mapsToProperty: string
    ): React.ReactNode {
        return (
            <div key={cssPropertySyntaxItem.mapsToProperty}>
                {this.renderPropertySyntaxSwitch(
                    cssPropertySyntaxItem.ref,
                    onChangeSyntaxHandler
                )}
                {this.renderPropertyFormElement(
                    cssPropertySyntaxItem.mapsToProperty,
                    this.state[mapsToProperty] ? this.state[mapsToProperty].index : 0,
                    combinatorType
                )}
            </div>
        );
    }

    private renderPropertySyntaxSwitch(
        ref: XOR<string, CSSPropertyRef[]>,
        handleOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    ): React.ReactNode {
        if (typeof ref === "string") {
            return null;
        }

        return (
            <select key={"switch"} onChange={handleOnChange}>
                <option key={"init"} value={void 0}></option>
                {ref.map((refItem: CSSPropertyRef, index: number) => {
                    if (typeof refItem.ref === "string") {
                        // This should always be a string, but check in case
                        return (
                            <option key={index} value={index}>
                                {refItem.ref}
                            </option>
                        );
                    }
                })}
            </select>
        );
    }

    private renderPropertyFormElements(
        mapsToProperty: string,
        combinatorType: CombinatorType
    ): React.ReactNode {
        return properties[mapsToProperty].syntax.ref.map((ref, index) => {
            return this.renderPropertyFormElement(mapsToProperty, index, combinatorType);
        });
    }

    private renderPropertyFormElement(
        mapsToProperty: string,
        index: number,
        combinatorType: CombinatorType
    ): React.ReactNode {
        const propertyRef: CSSPropertyRef =
            properties[mapsToProperty].syntax.ref[index] === undefined ||
            properties[mapsToProperty].syntax.ref[index].type === undefined
                ? properties[mapsToProperty].syntax
                : properties[mapsToProperty].syntax.ref[index];

        switch (propertyRef.type) {
            case "value":
                if (propertyRef.ref === "<declaration-value>") {
                    return this.renderDeclarationValue({
                        mapsToProperty,
                        combinatorType,
                        index,
                        changeHandler: this.getChangeHandler(mapsToProperty, index),
                        onChangeHandler: this.getInputOrSelectOnChangeHandler(
                            mapsToProperty,
                            index
                        ),
                    });
                }

                return null;
            case "property": {
                const property =
                    typeof properties[mapsToProperty].syntax.ref === "string"
                        ? properties[mapsToProperty].syntax.ref
                        : properties[mapsToProperty].syntax.ref[index].ref;

                return (
                    <React.Fragment key={index}>
                        {this.renderProperty(property)}
                    </React.Fragment>
                );
            }
            case "syntax": {
                const syntax =
                    typeof properties[mapsToProperty].syntax.ref === "string"
                        ? properties[mapsToProperty].syntax.ref
                        : properties[mapsToProperty].syntax.ref[index].ref;
                return (
                    <React.Fragment key={index}>
                        {this.renderSyntax(syntax, mapsToProperty, index, combinatorType)}
                    </React.Fragment>
                );
            }
            case "type": {
                const type =
                    typeof properties[mapsToProperty].syntax.ref === "string"
                        ? properties[mapsToProperty].syntax.ref
                        : properties[mapsToProperty].syntax.ref[index].ref;
                return (
                    <React.Fragment key={index}>
                        {this.renderType(type, mapsToProperty, index, combinatorType)}
                    </React.Fragment>
                );
            }
            case "group":
                return this.renderTypeGroup();
            default:
                return null;
        }
    }

    private renderDeclarationValue(config: RenderControlBaseConfig): React.ReactNode {
        return renderDeclarationValue(config);
    }

    private renderProperty(property: Property): React.ReactNode {
        const cssPropertyName = property.slice(2, property.length - 2);
        return this.renderCSSProperty(properties[cssPropertyName], cssPropertyName);
    }

    private renderSyntax(
        syntax: Syntax,
        mapsToProperty: string,
        inputIndex: number,
        combinatorType: CombinatorType
    ): React.ReactNode {
        return renderSyntaxControl(
            inputIndex,
            syntax,
            this.getInputOrSelectOnChangeHandler(mapsToProperty, inputIndex),
            this.getChangeHandler(mapsToProperty, inputIndex),
            combinatorType,
            mapsToProperty
        );
    }

    private renderType(
        type: Type,
        mapsToProperty: string,
        inputIndex: number,
        combinatorType: CombinatorType
    ): React.ReactNode {
        return renderTypeControl(
            inputIndex,
            type,
            this.getInputOrSelectOnChangeHandler(mapsToProperty, inputIndex),
            this.getChangeHandler(mapsToProperty, inputIndex),
            combinatorType,
            mapsToProperty
        );
    }

    private renderTypeGroup(): React.ReactNode {
        return "TODO: render group";
    }

    private getChangeHandler = (
        mapsToProperty: string,
        inputIndex: number
    ): ((value: string) => void) => {
        return (value: string) => {
            let values: string[] =
                this.state[mapsToProperty] &&
                Array.isArray(this.state[mapsToProperty].values)
                    ? this.state[mapsToProperty].values
                    : [];
            values[inputIndex] = value;

            const propertyState: PropertyState =
                this.state[mapsToProperty] !== undefined
                    ? {
                          ...this.state[mapsToProperty],
                          values,
                      }
                    : {
                          index: 0,
                          mapsToProperty,
                          values,
                      };

            this.setState(
                {
                    [mapsToProperty]: propertyState,
                },
                this.resolveCSS
            );
        };
    };

    private getInputOrSelectOnChangeHandler = (
        mapsToProperty: string,
        inputIndex: number
    ): ((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
            let values: string[] =
                this.state[mapsToProperty] &&
                Array.isArray(this.state[mapsToProperty].values)
                    ? this.state[mapsToProperty].values
                    : [];
            values[inputIndex] = e.currentTarget.value;

            const propertyState: PropertyState =
                this.state[mapsToProperty] !== undefined
                    ? {
                          ...this.state[mapsToProperty],
                          values,
                      }
                    : {
                          index: 0,
                          mapsToProperty,
                          values,
                      };

            this.setState(
                {
                    [mapsToProperty]: propertyState,
                },
                this.resolveCSS
            );
        };
    };

    /**
     * The change event handler for the switch if there are
     * a list of possible value types
     */
    private getRefOnChangeSyntaxSwitchHandler = (
        mapsToProperty: string
    ): ((e: React.ChangeEvent<HTMLSelectElement>) => void) => {
        return (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (e.currentTarget.value === "") {
                this.setState(
                    {
                        [mapsToProperty]: undefined,
                    },
                    this.resolveCSS
                );
            } else {
                const propertyState: PropertyState = {
                    index: parseInt(e.currentTarget.value, 10),
                    mapsToProperty,
                    values: [],
                };

                this.setState(
                    {
                        [mapsToProperty]: propertyState,
                    },
                    this.resolveCSS
                );
            }
        };
    };

    private resolveCSS = (): void => {
        this.props.onChange({
            value:
                `${Object.keys(this.state)
                    .reduce((previousValue: string, propertyName: string) => {
                        if (this.state[propertyName] === undefined) {
                            return previousValue;
                        }

                        return `${previousValue} ${propertyName}: ${resolveCSSValue(
                            this.state[propertyName],
                            properties[this.state[propertyName].mapsToProperty].syntax
                                .type,
                            properties[this.state[propertyName].mapsToProperty].syntax
                                .refCombinatorType,
                            properties[this.state[propertyName].mapsToProperty].syntax.ref
                        )};`;
                    }, "")
                    .trim()}` || undefined,
        });
    };
}

export { CSSControl };
export default manageJss(styles)(CSSControl);
