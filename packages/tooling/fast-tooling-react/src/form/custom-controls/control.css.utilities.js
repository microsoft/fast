/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */
export function renderDefault(config) {
    return renderTextInput(config);
}
function getInputChangeHandler(parentChangeHandler) {
    let timer = null;
    const handleCheck = newValue => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            parentChangeHandler(newValue);
        }, 500);
    };
    return e => {
        handleCheck(e.currentTarget.value);
    };
}
// TODO: is there a better way to retrieve design system context and use the tagFor?
// this is currently an experimental component however this should be adjusted before
// documentation and export
export function renderTextInput(config) {
    return (
        <fast-text-field
            {...Object.assign(
                {
                    key: `${config.dictionaryId}::${config.dataLocation}`,
                    events: {
                        input: getInputChangeHandler(config.handleChange),
                    },
                },
                config.value
                    ? {
                          value: config.value,
                      }
                    : {}
            )}
        ></fast-text-field>
    );
}
export function renderNumber(config) {
    return (
        <fast-number-field
            {...Object.assign(
                {
                    key: `${config.dictionaryId}::${config.dataLocation}`,
                    events: {
                        input: getInputChangeHandler(config.handleChange),
                    },
                },
                config.value
                    ? {
                          value: config.value,
                      }
                    : {}
            )}
        ></fast-number-field>
    );
}
export function renderInteger(config) {
    return (
        <fast-number-field
            {...Object.assign(
                {
                    key: `${config.dictionaryId}::${config.dataLocation}`,
                    events: {
                        input: getInputChangeHandler(config.handleChange),
                    },
                    step: 1,
                },
                config.value
                    ? {
                          value: config.value,
                      }
                    : {}
            )}
        ></fast-number-field>
    );
}
function getCheckboxInputChangeHandler(parentChangeHandler, value) {
    return e => {
        parentChangeHandler(e.currentTarget.checked ? value : "");
    };
}
export function renderCheckbox(config) {
    return (
        <fast-checkbox
            {...Object.assign(
                {
                    events: {
                        change: getCheckboxInputChangeHandler(
                            config.handleChange,
                            config.ref.ref
                        ),
                    },
                },
                config.value
                    ? {
                          value: config.value,
                      }
                    : {}
            )}
        >
            {config.ref.ref}
        </fast-checkbox>
    );
}
function getSelectionChangeHandler(parentChangeHandler) {
    return e => {
        parentChangeHandler(e.currentTarget.value);
    };
}
export function renderSelection(config) {
    const currentOption = config.options.find(
        option => option.displayName === config.value
    );
    const currentValue = currentOption ? `${currentOption.value}` : "";
    return (
        <fast-select
            key={`${config.dictionaryId}::${config.dataLocation}`}
            events={{
                change: getSelectionChangeHandler(config.handleChange),
            }}
        >
            {config.options.map(option => {
                return (
                    <fast-option
                        {...Object.assign(
                            {
                                value: `${option.value}`,
                                key: `${config.dictionaryId}::${config.dataLocation}::${option.key}`,
                            },
                            `${option.value}` === currentValue
                                ? {
                                      selected: "",
                                  }
                                : {}
                        )}
                    >
                        {option.displayName}
                    </fast-option>
                );
            })}
        </fast-select>
    );
}
function getColorPickerChangeHandler(parentChangeHandler) {
    let timer = null;
    const handleCheck = newValue => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            parentChangeHandler(newValue);
        }, 500);
    };
    return e => {
        handleCheck(e.currentTarget.value);
    };
}
export function renderColorPicker(config) {
    return (
        <fast-tooling-color-picker
            key={`${config.dictionaryId}::${config.dataLocation}`}
            value={config.value}
            events={{
                change: getColorPickerChangeHandler(config.handleChange),
            }}
        ></fast-tooling-color-picker>
    );
}
