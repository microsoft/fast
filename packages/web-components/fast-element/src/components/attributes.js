import { Observable } from "../observation/observable";
import { DOM } from "../dom";
/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
export const booleanConverter = {
    toView(value) {
        return value ? "true" : "false";
    },
    fromView(value) {
        if (
            value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
        ) {
            return false;
        }
        return true;
    },
};
/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
export const nullableNumberConverter = {
    toView(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number.toString();
    },
    fromView(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number;
    },
};
/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
export class AttributeDefinition {
    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    constructor(
        Owner,
        name,
        attribute = name.toLowerCase(),
        mode = "reflect",
        converter
    ) {
        this.guards = new Set();
        this.Owner = Owner;
        this.name = name;
        this.attribute = attribute;
        this.mode = mode;
        this.converter = converter;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;
        if (mode === "boolean" && converter === void 0) {
            this.converter = booleanConverter;
        }
    }
    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param value - The value to set the attribute/property to.
     */
    setValue(source, newValue) {
        const oldValue = source[this.fieldName];
        const converter = this.converter;
        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }
        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;
            this.tryReflectToAttribute(source);
            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }
            source.$fastController.notify(this.name);
        }
    }
    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    getValue(source) {
        Observable.track(source, this.name);
        return source[this.fieldName];
    }
    /** @internal */
    onAttributeChangedCallback(element, value) {
        if (this.guards.has(element)) {
            return;
        }
        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }
    tryReflectToAttribute(element) {
        const mode = this.mode;
        const guards = this.guards;
        if (guards.has(element) || mode === "fromView") {
            return;
        }
        DOM.queueUpdate(() => {
            guards.add(element);
            const latestValue = element[this.fieldName];
            switch (mode) {
                case "reflect":
                    const converter = this.converter;
                    DOM.setAttribute(
                        element,
                        this.attribute,
                        converter !== void 0 ? converter.toView(latestValue) : latestValue
                    );
                    break;
                case "boolean":
                    DOM.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }
            guards.delete(element);
        });
    }
    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    static collect(Owner, ...attributeLists) {
        const attributes = [];
        attributeLists.push(Owner.attributes);
        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];
            if (list === void 0) {
                continue;
            }
            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];
                if (typeof config === "string") {
                    attributes.push(new AttributeDefinition(Owner, config));
                } else {
                    attributes.push(
                        new AttributeDefinition(
                            Owner,
                            config.property,
                            config.attribute,
                            config.mode,
                            config.converter
                        )
                    );
                }
            }
        }
        return attributes;
    }
}
export function attr(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }
        const attributes =
            $target.constructor.attributes || ($target.constructor.attributes = []);
        attributes.push(config);
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
