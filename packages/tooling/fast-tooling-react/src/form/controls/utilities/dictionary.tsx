import React from "react";
import { isPlainObject, uniqueId } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { DictionaryClassNameContract } from "./dictionary.style";
import { DictionaryProps, DictionaryState } from "./dictionary.props";
import ControlSwitch from "./control-switch";
import { generateExampleData, getErrorFromDataLocation } from "./form";
import { PropertyKeyword } from "@microsoft/fast-tooling";

/**
 *  control definition
 */
class Dictionary extends React.Component<
    DictionaryProps & ManagedClasses<DictionaryClassNameContract>,
    DictionaryState
> {
    public static displayName: string = "Dictionary";

    private rootElementRef: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: DictionaryProps) {
        super(props);

        this.state = {
            focusedPropertyKey: null,
            focusedPropertyKeyValue: null,
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                className={this.props.managedClasses.dictionary}
                ref={this.rootElementRef}
            >
                {this.renderControl()}
                {this.renderControls()}
            </div>
        );
    }

    public componentDidMount(): void {
        this.updateValidity();
    }

    public componentDidUpdate(): void {
        this.updateValidity();
    }

    private updateValidity(): void {
        if (this.props.additionalProperties === false) {
            const {
                dictionary_itemControlInput,
            }: DictionaryClassNameContract = this.props.managedClasses;

            this.rootElementRef.current
                .querySelectorAll<HTMLInputElement>(`.${dictionary_itemControlInput}`)
                .forEach((itemControlInput: HTMLInputElement) => {
                    itemControlInput.setCustomValidity(
                        "should NOT have additional properties"
                    );
                });
        }
    }

    private renderControl(): React.ReactNode {
        const {
            dictionary_controlAddTrigger,
            dictionary_controlLabel,
            dictionary_control,
            dictionary_controlRegion,
        }: DictionaryClassNameContract = this.props.managedClasses;

        if (isPlainObject(this.props.additionalProperties)) {
            return (
                <div className={dictionary_controlRegion}>
                    <div className={dictionary_control}>
                        <label className={dictionary_controlLabel}>
                            {this.props.label}
                        </label>
                    </div>
                    <button
                        className={dictionary_controlAddTrigger}
                        aria-label={"Select to add item"}
                        onClick={this.handleOnAddItem}
                    />
                </div>
            );
        }
    }

    private renderItemControl(propertyName: string): React.ReactNode {
        const {
            dictionary_itemControlRegion,
            dictionary_itemControl,
            dictionary_itemControlLabel,
            dictionary_itemControlInput,
            dictionary_itemControlRemoveTrigger,
        }: DictionaryClassNameContract = this.props.managedClasses;

        return (
            <div className={dictionary_itemControlRegion}>
                <div className={dictionary_itemControl}>
                    <label className={dictionary_itemControlLabel}>
                        {this.props.propertyLabel}
                    </label>
                    <input
                        className={dictionary_itemControlInput}
                        type={"text"}
                        value={
                            this.state.focusedPropertyKey === propertyName
                                ? this.state.focusedPropertyKeyValue
                                : propertyName
                        }
                        onFocus={this.handleKeyFocus(propertyName)}
                        onBlur={this.handleKeyBlur(propertyName)}
                        onChange={this.handleKeyChange(propertyName)}
                    />
                    <button
                        className={dictionary_itemControlRemoveTrigger}
                        onClick={this.handleOnRemoveItem(propertyName)}
                    />
                </div>
            </div>
        );
    }

    private renderControls(): React.ReactNode {
        return (typeof this.props.data !== "undefined"
            ? Object.keys(this.props.data)
            : []
        ).reduce(
            (
                accumulator: React.ReactNode,
                currentKey: string,
                index: number
            ): React.ReactNode => {
                if (!this.props.enumeratedProperties.includes(currentKey)) {
                    const dataLocation: string = this.getDataLocation(currentKey);
                    const invalidMessage: string = getErrorFromDataLocation(
                        dataLocation,
                        this.props.validationErrors
                    );

                    return (
                        <React.Fragment key={dataLocation}>
                            {accumulator}
                            <div key={this.props.schemaLocation + index}>
                                {this.renderItemControl(currentKey)}
                                <ControlSwitch
                                    index={index}
                                    controls={this.props.controls}
                                    controlPlugins={this.props.controlPlugins}
                                    controlComponents={this.props.controlComponents}
                                    label={this.props.label}
                                    onChange={this.props.onChange}
                                    propertyName={currentKey}
                                    schemaLocation={this.getSchemaLocation(currentKey)}
                                    dataLocation={dataLocation}
                                    data={this.getData(currentKey)}
                                    schema={this.props.additionalProperties}
                                    disabled={this.props.additionalProperties === false}
                                    onUpdateSection={this.props.onUpdateSection}
                                    required={this.isRequired(currentKey)}
                                    invalidMessage={invalidMessage}
                                    softRemove={false}
                                    displayValidationInline={
                                        this.props.displayValidationInline
                                    }
                                    displayValidationBrowserDefault={
                                        this.props.displayValidationBrowserDefault
                                    }
                                />
                            </div>
                        </React.Fragment>
                    );
                }
                return accumulator;
            },
            null
        );
    }

    private handleOnAddItem = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const key: string = uniqueId("example");

        if (typeof this.props.default !== "undefined") {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                dictionaryId: this.props.dictionaryId,
                value: this.props.default,
            });
        } else if (Array.isArray(this.props.examples) && this.props.examples.length > 0) {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                dictionaryId: this.props.dictionaryId,
                value: this.props.examples[0],
            });
        } else {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                dictionaryId: this.props.dictionaryId,
                value: generateExampleData(this.props.additionalProperties, ""),
            });
        }
    };

    private handleOnRemoveItem = (
        propertyName: string
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${propertyName}`,
                dictionaryId: this.props.dictionaryId,
                value: void 0,
            });
        };
    };

    private handleKeyChange = (
        propertyName: string
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({
                focusedPropertyKeyValue: e.target.value,
            });
        };
    };

    private handleKeyFocus = (
        propertyName: string
    ): ((e: React.FocusEvent<HTMLInputElement>) => void) => {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            this.setState({
                focusedPropertyKey: propertyName,
                focusedPropertyKeyValue: propertyName,
            });
        };
    };

    private handleKeyBlur = (
        propertyName: string
    ): ((e: React.FocusEvent<HTMLInputElement>) => void) => {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            const dataKeys: string[] =
                typeof this.props.data === "undefined"
                    ? []
                    : Object.keys(this.props.data);
            const data: any = {};

            dataKeys.forEach((dataKey: string) => {
                data[
                    dataKey === propertyName ? e.target.value : dataKey
                ] = this.props.data[dataKey];
            });

            this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: data,
            });

            this.setState({
                focusedPropertyKey: null,
                focusedPropertyKeyValue: null,
            });
        };
    };

    private getSchemaLocation(propertyName: string): string {
        return `${
            this.props.schemaLocation === "" ? "" : `${this.props.schemaLocation}.`
        }${PropertyKeyword.additionalProperties}.${propertyName}`;
    }

    private getDataLocation(propertyName: string): string {
        return `${this.props.dataLocation}${
            this.props.dataLocation !== "" ? "." : ""
        }${propertyName}`;
    }

    private getData(propertyName: string): any {
        return this.props.data[propertyName];
    }

    private isRequired(propertyName: string): any {
        return (
            Array.isArray(this.props.required) &&
            this.props.required.includes(propertyName)
        );
    }
}

export { Dictionary };
export default manageJss(styles)(Dictionary);
