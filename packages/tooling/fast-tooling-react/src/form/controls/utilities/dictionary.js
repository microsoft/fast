import React from "react";
import { isPlainObject, uniqueId } from "lodash-es";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./dictionary.style";
import ControlSwitch from "./control-switch";
import { generateExampleData, getErrorFromDataLocation } from "./form";
import { PropertyKeyword } from "@microsoft/fast-tooling";
/**
 *  control definition
 */
class Dictionary extends React.Component {
    constructor(props) {
        super(props);
        this.rootElementRef = React.createRef();
        this.handleOnAddItem = e => {
            const key = uniqueId("example");
            if (typeof this.props.default !== "undefined") {
                this.props.onChange({
                    dataLocation: `${
                        this.props.dataLocation === ""
                            ? ""
                            : `${this.props.dataLocation}.`
                    }${key}`,
                    dictionaryId: this.props.dictionaryId,
                    value: this.props.default,
                });
            } else if (
                Array.isArray(this.props.examples) &&
                this.props.examples.length > 0
            ) {
                this.props.onChange({
                    dataLocation: `${
                        this.props.dataLocation === ""
                            ? ""
                            : `${this.props.dataLocation}.`
                    }${key}`,
                    dictionaryId: this.props.dictionaryId,
                    value: this.props.examples[0],
                });
            } else {
                this.props.onChange({
                    dataLocation: `${
                        this.props.dataLocation === ""
                            ? ""
                            : `${this.props.dataLocation}.`
                    }${key}`,
                    dictionaryId: this.props.dictionaryId,
                    value: generateExampleData(this.props.additionalProperties, ""),
                });
            }
        };
        this.handleOnRemoveItem = propertyName => {
            return e => {
                this.props.onChange({
                    dataLocation: `${
                        this.props.dataLocation === ""
                            ? ""
                            : `${this.props.dataLocation}.`
                    }${propertyName}`,
                    dictionaryId: this.props.dictionaryId,
                    value: void 0,
                });
            };
        };
        this.handleKeyPress = () => {
            return e => {
                if (e.keyCode === 13) {
                    e.currentTarget.blur();
                    e.preventDefault();
                }
            };
        };
        this.handleKeyChange = propertyName => {
            return e => {
                this.setState({
                    focusedPropertyKeyValue: e.target.value,
                });
            };
        };
        this.handleKeyFocus = propertyName => {
            return e => {
                this.setState({
                    focusedPropertyKey: propertyName,
                    focusedPropertyKeyValue: propertyName,
                });
            };
        };
        this.handleKeyBlur = propertyName => {
            return e => {
                const dataKeys =
                    typeof this.props.data === "undefined"
                        ? []
                        : Object.keys(this.props.data);
                const data = {};
                dataKeys.forEach(dataKey => {
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
        this.state = {
            focusedPropertyKey: null,
            focusedPropertyKeyValue: null,
        };
    }
    render() {
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
    componentDidMount() {
        this.updateValidity();
    }
    componentDidUpdate() {
        this.updateValidity();
    }
    updateValidity() {
        if (this.props.additionalProperties === false) {
            const { dictionary_itemControlInput } = this.props.managedClasses;
            this.rootElementRef.current
                .querySelectorAll(`.${dictionary_itemControlInput}`)
                .forEach(itemControlInput => {
                    itemControlInput.setCustomValidity(
                        "should NOT have additional properties"
                    );
                });
        }
    }
    renderControl() {
        const {
            dictionary_controlAddTrigger,
            dictionary_controlLabel,
            dictionary_control,
            dictionary_controlRegion,
        } = this.props.managedClasses;
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
    renderItemControl(propertyName) {
        const {
            dictionary_itemControlRegion,
            dictionary_itemControl,
            dictionary_itemControlLabel,
            dictionary_itemControlInput,
            dictionary_itemControlRemoveTrigger,
        } = this.props.managedClasses;
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
                        onKeyDown={this.handleKeyPress()}
                        onChange={this.handleKeyChange(propertyName)}
                        readOnly={this.props.additionalProperties === false}
                    />
                    <button
                        className={dictionary_itemControlRemoveTrigger}
                        onClick={this.handleOnRemoveItem(propertyName)}
                    />
                </div>
            </div>
        );
    }
    renderControls() {
        return (typeof this.props.data !== "undefined"
            ? Object.keys(this.props.data)
            : []
        ).reduce((accumulator, currentKey, index) => {
            if (!this.props.enumeratedProperties.includes(currentKey)) {
                const dataLocation = this.getDataLocation(currentKey);
                const invalidMessage = getErrorFromDataLocation(
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
                                strings={this.props.strings}
                                type={this.props.type}
                                categories={this.props.categories}
                                untitled={this.props.untitled}
                                dictionaryId={this.props.dictionaryId}
                                dataDictionary={this.props.dataDictionary}
                                navigation={this.props.navigation}
                                navigationConfigId={this.props.navigationConfigId}
                                validationErrors={this.props.validationErrors}
                                schemaDictionary={this.props.schemaDictionary}
                                messageSystem={this.props.messageSystem}
                                messageSystemOptions={this.props.messageSystemOptions}
                            />
                        </div>
                    </React.Fragment>
                );
            }
            return accumulator;
        }, null);
    }
    getSchemaLocation(propertyName) {
        return `${
            this.props.schemaLocation === "" ? "" : `${this.props.schemaLocation}.`
        }${PropertyKeyword.additionalProperties}.${propertyName}`;
    }
    getDataLocation(propertyName) {
        return `${this.props.dataLocation}${
            this.props.dataLocation !== "" ? "." : ""
        }${propertyName}`;
    }
    getData(propertyName) {
        return this.props.data[propertyName];
    }
    isRequired(propertyName) {
        return (
            Array.isArray(this.props.required) &&
            this.props.required.includes(propertyName)
        );
    }
}
Dictionary.displayName = "Dictionary";
export { Dictionary };
export default manageJss(styles)(Dictionary);
