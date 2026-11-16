const own = (value, key) => Object.hasOwn(value, key);
const object = value =>
    value !== null && typeof value === "object" && !Array.isArray(value);

function validate(value, ancestors = new Set(), copy = false) {
    if (typeof value === "string" && !value.isWellFormed()) {
        throw new TypeError("SSR strings must contain well-formed Unicode.");
    }
    if (
        value === null ||
        typeof value === "string" ||
        typeof value === "boolean" ||
        (typeof value === "number" && Number.isFinite(value))
    ) {
        return value === 0 ? 0 : value;
    }
    if (
        typeof value !== "object" ||
        ancestors.has(value) ||
        (Array.isArray(value)
            ? Object.getPrototypeOf(value) !== Array.prototype
            : Object.getPrototypeOf(value) !== Object.prototype &&
              Object.getPrototypeOf(value) !== null)
    ) {
        throw new TypeError("SSR state must be acyclic JSON-shaped data.");
    }
    ancestors.add(value);
    const keys = Reflect.ownKeys(value);
    const array = Array.isArray(value);
    if (array && keys.length !== value.length + 1) {
        throw new TypeError("SSR arrays must be dense and have no extra properties.");
    }
    const count = array ? value.length : keys.length;
    const snapshot = copy ? (array ? [] : Object.create(null)) : null;
    let changes;
    for (let index = 0; index < count; index++) {
        const key = keys[index];
        if (typeof key !== "string" || !key.isWellFormed()) {
            throw new TypeError("SSR property names must contain well-formed Unicode.");
        }
        if (array && key !== String(index)) {
            throw new TypeError("SSR arrays must be dense and have no extra properties.");
        }
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor.enumerable || !own(descriptor, "value")) {
            throw new TypeError("SSR state requires enumerable data properties.");
        }
        const normalized = validate(descriptor.value, ancestors, copy);
        if (copy) {
            snapshot[key] = normalized;
        } else if (!Object.is(normalized, descriptor.value)) {
            (changes ??= []).push([key, normalized]);
        }
    }
    ancestors.delete(value);
    if (copy) return Object.freeze(snapshot);
    if (changes) {
        const normalized = array
            ? value.slice()
            : Object.assign(Object.create(null), value);
        for (const [key, item] of changes) {
            normalized[key] = item;
        }
        return normalized;
    }
    return value;
}

const preparedStates = new WeakMap();
class PreparedState {}

export function prepareState(state = {}) {
    const values = validate(state, new Set(), true);
    const handle = Object.freeze(new PreparedState());
    preparedStates.set(handle, { values });
    return handle;
}

export function preparedRequest(state, options = {}) {
    const snapshot = preparedStates.get(state);
    if (!snapshot) {
        throw new TypeError("Expected a prepared SSR state from this runtime.");
    }
    return requestOptions(snapshot.values, options);
}

export function request(state = {}, options = {}) {
    return requestOptions(validate(state), options);
}

function requestOptions(state, options) {
    const strategy = options.attributeNameStrategy ?? "camelCase";
    if (strategy !== "camelCase" && strategy !== "none") {
        throw new TypeError("attributeNameStrategy must be camelCase or none.");
    }
    if (options.markersV2 !== undefined && typeof options.markersV2 !== "boolean") {
        throw new TypeError("markersV2 must be a boolean.");
    }
    if (
        options.dsd !== undefined &&
        (!Array.isArray(options.dsd) ||
            options.dsd.some(name => typeof name !== "string"))
    ) {
        throw new TypeError("dsd must be an array of component names.");
    }
    return [
        { values: state, parent: null },
        {
            strategy,
            v2: options.markersV2 === true,
            dsd: options.dsd && new Set(options.dsd),
        },
    ];
}

function nested(value, path, start = 0, indexes) {
    for (let index = start; index < path.length; index++) {
        const key = path[index];
        if (Array.isArray(value)) {
            if (key === "length") {
                return index === path.length - 1 ? value.length : undefined;
            }
            const arrayIndex = indexes
                ? indexes[index]
                : /^\+?\d+$/.test(key)
                  ? Number(key)
                  : null;
            if (arrayIndex === null) {
                return undefined;
            }
            value =
                arrayIndex < value.length && own(value, arrayIndex)
                    ? value[arrayIndex]
                    : undefined;
        } else if (object(value) && own(value, key)) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    return value;
}

function getRoot(root, path, indexes) {
    for (let frame = root; frame; frame = frame.parent) {
        const value = nested(frame.values, path, 0, indexes);
        if (value !== undefined || (object(frame.values) && own(frame.values, path[0]))) {
            return value;
        }
    }
}

export function access(path, aliases) {
    const indexes = path.map(key => (/^\+?\d+$/.test(key) ? Number(key) : null));
    const rootAccess =
        path.length === 1
            ? root => rootKey(root, path[0], indexes[0])
            : root => getRoot(root, path, indexes);
    if (aliases.length === 0) {
        return rootAccess;
    }
    if (aliases.length === 1) {
        const [slot, start] = aliases[0];
        return (root, loops) => {
            const binding = loops?.values[slot];
            return binding
                ? nested(binding.value, path, start, indexes)
                : rootAccess(root);
        };
    }
    return (root, loops) => {
        let selected;
        let start = 0;
        if (loops) {
            for (const [slot, length] of aliases) {
                const binding = loops.values[slot];
                if (binding && (!selected || binding.depth > selected.depth)) {
                    selected = binding;
                    start = length;
                }
            }
        }
        return selected ? nested(selected.value, path, start, indexes) : rootAccess(root);
    };
}

function rootKey(root, key, index) {
    for (let frame = root; frame; frame = frame.parent) {
        const values = frame.values;
        if (object(values) && own(values, key)) {
            return values[key];
        }
        if (Array.isArray(values)) {
            if (key === "length") return values.length;
            if (index !== null && index < values.length && own(values, index)) {
                const value = values[index];
                if (value !== undefined) return value;
            }
        }
    }
}

export function loop(parent, slot) {
    // The implicit $index slot must outrank its iteration's named alias.
    const depth = (parent?.depth ?? 0) + 2;
    const values = Object.create(parent?.values ?? null);
    const value = { depth: depth - 1, value: undefined };
    const index = { depth, value: 0 };
    values[slot] = value;
    values[0] = index;
    return { values, depth, value, index };
}

export function child(root, entries) {
    const values = Object.create(null);
    let copied;
    for (const [key, group, value] of entries) {
        if (group === null) {
            values[key] = value === undefined ? null : value;
            copied?.delete(key);
        } else {
            if (!own(values, key)) {
                const inherited = getRoot(root, [key]);
                values[key] = inherited === undefined ? Object.create(null) : inherited;
            }
            if (object(values[key])) {
                if (!copied?.has(key)) {
                    values[key] = Object.assign(Object.create(null), values[key]);
                    (copied ??= new Set()).add(key);
                }
                values[key][group] = value === undefined ? null : value;
            }
        }
    }
    return { values, parent: object(root.values) ? root : null };
}

export function number(value) {
    if (value === Infinity || value === -Infinity) {
        return value < 0 ? "-inf" : "inf";
    }
    if (Object.is(value, -0)) {
        return "-0";
    }
    const text = String(value);
    if (!text.includes("e")) {
        return text;
    }
    const [mantissa, exponent] = text.split("e");
    const negative = mantissa.startsWith("-");
    const unsigned = negative ? mantissa.slice(1) : mantissa;
    const [integer, fraction = ""] = unsigned.split(".");
    const digits = integer + fraction;
    const point = integer.length + Number(exponent);
    const expanded =
        point <= 0
            ? `0.${"0".repeat(-point)}${digits}`
            : point >= digits.length
              ? digits + "0".repeat(point - digits.length)
              : `${digits.slice(0, point)}.${digits.slice(point)}`;
    return (negative ? "-" : "") + expanded;
}

export function text(value) {
    if (value === undefined || value === null) {
        return "";
    }
    if (typeof value === "number") {
        return value === 0 ? "0" : number(value);
    }
    return Array.isArray(value) ? "[Array]" : object(value) ? "[Object]" : String(value);
}

const htmlEntities = Object.freeze({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
});
const htmlEntity = character => htmlEntities[character];
export const htmlEscape = value => value.replace(/[&<>"']/g, htmlEntity);

export const truthy = value => Boolean(value);

function equal(left, right) {
    if (left === null || right === null) {
        return left === right;
    }
    if (typeof left === typeof right) {
        return typeof left !== "object" && left === right;
    }
    if (
        (typeof left === "string" &&
            (typeof right === "boolean" || typeof right === "number")) ||
        (typeof right === "string" &&
            (typeof left === "boolean" || typeof left === "number"))
    ) {
        return text(left) === text(right);
    }
    return false;
}

function numeric(value) {
    if (typeof value === "number" || typeof value === "boolean") {
        return Number(value);
    }
    if (
        typeof value === "string" &&
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
    ) {
        return Number(value);
    }
    if (typeof value === "string" && /^[+-]?inf(?:inity)?$/i.test(value)) {
        return value.startsWith("-") ? -Infinity : Infinity;
    }
    if (typeof value === "string" && /^[+-]?nan$/i.test(value)) {
        return NaN;
    }
}

export function compare(left, right, operator) {
    if (left === undefined || right === undefined) {
        return left === right
            ? operator === "==" || operator === ">=" || operator === "<="
            : operator === "!=";
    }
    if (operator === "==" || operator === "!=") {
        return equal(left, right) === (operator === "==");
    }
    const a = numeric(left);
    const b = numeric(right);
    let order;
    if (a !== undefined && b !== undefined) {
        order = a < b ? -1 : a > b ? 1 : 0;
    } else {
        const leftPoints = Array.from(text(left), character => character.codePointAt(0));
        const rightPoints = Array.from(text(right), character =>
            character.codePointAt(0),
        );
        order = 0;
        for (
            let index = 0;
            index < Math.max(leftPoints.length, rightPoints.length);
            index++
        ) {
            if (leftPoints[index] !== rightPoints[index]) {
                order =
                    leftPoints[index] === undefined ||
                    leftPoints[index] < rightPoints[index]
                        ? -1
                        : 1;
                break;
            }
        }
    }
    return operator === ">"
        ? order > 0
        : operator === "<"
          ? order < 0
          : operator === ">="
            ? order >= 0
            : order <= 0;
}

export function attribute(name, value, boolean, primitive = false) {
    if (boolean && typeof value === "boolean") {
        return value ? ` ${name}` : "";
    }
    if (
        value === undefined ||
        value === null ||
        (primitive && typeof value === "object")
    ) {
        return "";
    }
    return ` ${name}="${htmlEscape(primitive && typeof value === "number" ? number(value) : text(value))}"`;
}

export function composite(parts) {
    return parts.some(part => part === undefined || part === null)
        ? null
        : parts.join("");
}

export const segment = value =>
    value === undefined || value === null ? null : htmlEscape(text(value));
export const quoted = (name, value) =>
    value === null ? "" : ` ${name}="${value.replaceAll('"', "&quot;")}"`;

export function list(value, expression) {
    if (value === undefined) {
        return [];
    }
    if (!Array.isArray(value)) {
        throw Object.assign(new Error(`repeat binding '${expression}' is not an array`), {
            code: "repeat-not-array",
        });
    }
    return value;
}

export const scope = options => ({ index: 0, v2: options.v2 });
export const selected = (options, name) => !options.dsd || options.dsd.has(name);
export const start = (scope, index) =>
    scope.v2 ? `<!--fe-b$$start$$${index}$$fast-build$$fe-b-->` : "<!--fe:b-->";
export const end = (scope, index) =>
    scope.v2 ? `<!--fe-b$$end$$${index}$$fast-build$$fe-b-->` : "<!--fe:/b-->";
export const repeatStart = (scope, index) =>
    scope.v2 ? `<!--fe-repeat$$start$$${index}$$fe-repeat-->` : "<!--fe:r-->";
export const repeatEnd = (scope, index) =>
    scope.v2 ? `<!--fe-repeat$$end$$${index}$$fe-repeat-->` : "<!--fe:/r-->";
export function marker(scope, count) {
    const index = scope.index;
    scope.index += count;
    return scope.v2
        ? count === 1
            ? `data-fe-b-${index}`
            : `data-fe-c-${index}-${count}`
        : `data-fe="${count}"`;
}

/**
 * Lower stable semantic operations once, without evaluating generated source.
 * Application state is supplied only to the returned render methods.
 */
export function createServerRenderer(plan) {
    const components = new Map();
    const invalid = () => {
        throw new TypeError("Invalid or incompatible FAST server plan.");
    };
    const missing = name => {
        throw Object.assign(new Error(`Unknown component: ${name}`), {
            code: "missing-template",
            templateName: name,
        });
    };

    const fields = (value, names) => {
        if (
            !object(value) ||
            Object.keys(value).length !== names.length ||
            names.some(name => !own(value, name))
        ) {
            invalid();
        }
        return value;
    };
    const array = value => {
        if (!Array.isArray(value)) invalid();
        for (let index = 0; index < value.length; index++) {
            if (!own(value, index)) invalid();
        }
        return value;
    };
    const record = (value, length) => {
        if (array(value).length !== length) invalid();
        return value;
    };
    const string = value => {
        if (typeof value !== "string") invalid();
        return value;
    };
    const boolean = value => {
        if (typeof value !== "boolean") invalid();
        return value;
    };
    const count = value => {
        if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000) invalid();
        return value;
    };
    fields(plan, ["format", "version", "entry", "templates", "components"]);
    if (plan.format !== "fast-server-js" || plan.version !== 1) invalid();
    if (!object(plan.templates) || !object(plan.components)) invalid();
    const templates = new Map(Object.entries(plan.templates));
    if (templates.size >= 1_000_000 || templates.has("")) invalid();
    const aliases = [["$index"]];
    const path = value => {
        if (!array(value).length) invalid();
        return value.map(string);
    };
    let total = 0;
    for (const body of [plan.entry, ...templates.values()]) {
        for (const op of array(body)) {
            if (++total > 1_000_000) invalid();
            array(op);
            if (op[0] === "repeat") {
                const name = path(op[1]);
                if (!aliases.some(alias => samePath(alias, name))) aliases.push(name);
            }
        }
    }
    function samePath(left, right) {
        return left.length === right.length && left.every((part, i) => part === right[i]);
    }
    function lookup(value) {
        const segments = path(value);
        const slots = aliases.flatMap((alias, slot) =>
            alias.length <= segments.length &&
            alias.every((segment, index) => segment === segments[index])
                ? [[slot, alias.length]]
                : [],
        );
        return access(segments, slots);
    }
    function literal(node, depth = 0) {
        if (depth > 64) invalid();
        array(node);
        if (node[0] === "null") {
            record(node, 1);
            return () => null;
        }
        record(node, 2);
        switch (node[0]) {
            case "bool": {
                const value = boolean(node[1]);
                return () => value;
            }
            case "string": {
                const value = string(node[1]);
                return () => value;
            }
            case "number": {
                const encoded = string(node[1]);
                const value =
                    encoded === "inf"
                        ? Infinity
                        : encoded === "-inf"
                          ? -Infinity
                          : Number(encoded);
                if (Number.isNaN(value) && encoded !== "NaN") invalid();
                return () => value;
            }
            case "array": {
                const values = array(node[1]).map(value => literal(value, depth + 1));
                return () => values.map(value => value());
            }
            case "object": {
                if (!object(node[1])) invalid();
                const values = Object.entries(node[1]).map(([key, value]) => [
                    key,
                    literal(value, depth + 1),
                ]);
                return () =>
                    Object.fromEntries(values.map(([key, value]) => [key, value()]));
            }
            default:
                invalid();
        }
    }
    function operand(node) {
        record(node, 2);
        if (node[0] === "path") return lookup(node[1]);
        if (node[0] === "value") return literal(node[1]);
        invalid();
    }
    function condition(node, depth = 0) {
        if (depth > 64) invalid();
        array(node);
        if (node[0] === "&&" || node[0] === "||") {
            record(node, 3);
            const left = condition(node[1], depth + 1);
            const right = condition(node[2], depth + 1);
            return node[0] === "&&"
                ? (r, l) => left(r, l) && right(r, l)
                : (r, l) => left(r, l) || right(r, l);
        }
        if (node[0] === "not" || node[0] === "truthy") {
            record(node, 2);
            const value = lookup(node[1]);
            return node[0] === "not"
                ? (r, l) => !truthy(value(r, l))
                : (r, l) => truthy(value(r, l));
        }
        if (node[0] === "compare") {
            record(node, 4);
            const operator = string(node[1]);
            if (!["==", "!=", ">", "<", ">=", "<="].includes(operator)) invalid();
            const left = lookup(node[2]);
            const right = operand(node[3]);
            return (r, l) => compare(left(r, l), right(r, l), operator);
        }
        invalid();
    }
    function attr(node) {
        array(node);
        switch (node[0]) {
            case "literal": {
                record(node, 2);
                const value = string(node[1]);
                return () => value;
            }
            case "attribute": {
                record(node, 5);
                const name = string(node[1]);
                const value = lookup(node[2]);
                const isBoolean = boolean(node[3]);
                const primitive = boolean(node[4]);
                return (r, l) => attribute(name, value(r, l), isBoolean, primitive);
            }
            case "conditional": {
                record(node, 3);
                const test = condition(node[1]);
                const value = string(node[2]);
                return (r, l) => (test(r, l) ? value : "");
            }
            case "quoted": {
                record(node, 3);
                const name = string(node[1]);
                const parts = array(node[2]).map(part => {
                    record(part, 2);
                    if (part[0] === "literal") return attr(part);
                    if (part[0] !== "segment") invalid();
                    const value = lookup(part[1]);
                    return (r, l) => segment(value(r, l));
                });
                return (r, l) => quoted(name, composite(parts.map(part => part(r, l))));
            }
            default:
                invalid();
        }
    }
    const attrs = values => array(values).map(attr);
    function tag(value) {
        fields(value, ["plain", "hydrated", "count", "ending"]);
        const plain = attrs(value.plain);
        const hydrated = attrs(value.hydrated);
        const bindings = count(value.count);
        const ending = string(value.ending);
        return (r, l, o, h) => {
            let output = "";
            for (const part of h ? hydrated : plain) output += part(r, l);
            if (h && bindings) output += ` ${marker(h, bindings)}${ending}`;
            return output;
        };
    }
    const compiled = new Map();
    const visiting = new Set();
    function template(name) {
        string(name);
        if (!templates.has(name) || visiting.has(name) || visiting.size > 256) invalid();
        if (compiled.has(name)) return compiled.get(name);
        visiting.add(name);
        const run = bodyOf(templates.get(name));
        visiting.delete(name);
        compiled.set(name, run);
        return run;
    }
    function operation(node) {
        array(node);
        switch (node[0]) {
            case "literal":
                return attr(node);
            case "template":
                record(node, 2);
                return template(node[1]);
            case "tag":
                record(node, 2);
                return tag(node[1]);
            case "binding": {
                record(node, 3);
                const value = lookup(node[1]);
                const escaped = boolean(node[2]);
                return (r, l, o, h) => {
                    const index = h ? h.index++ : 0;
                    const output = text(value(r, l));
                    const content = escaped ? htmlEscape(output) : output;
                    return h ? start(h, index) + content + end(h, index) : content;
                };
            }
            case "when": {
                record(node, 3);
                const test = condition(node[1]);
                const body = template(node[2]);
                return (r, l, o, h) => {
                    const index = h ? h.index++ : 0;
                    const output = test(r, l)
                        ? body(r, l, o, h ? scope(o) : null, false)
                        : "";
                    return h ? start(h, index) + output + end(h, index) : output;
                };
            }
            case "repeat": {
                record(node, 5);
                const name = path(node[1]);
                const slot = aliases.findIndex(alias => samePath(alias, name));
                const value = lookup(node[2]);
                const expression = string(node[3]);
                const body = template(node[4]);
                return (r, l, o, h) => {
                    const items = list(value(r, l), expression);
                    const binding = h ? h.index++ : 0;
                    let output = h ? start(h, binding) : "";
                    const next = items.length ? loop(l, slot) : null;
                    for (let index = 0; index < items.length; index++) {
                        next.value.value = items[index];
                        next.index.value = index;
                        if (h) output += repeatStart(h, index);
                        output += body(r, next, o, h ? scope(o) : null, false);
                        if (h) output += repeatEnd(h, index);
                    }
                    return h ? output + end(h, binding) : output;
                };
            }
            case "element": {
                record(node, 2);
                const element = fields(node[1], [
                    "name",
                    "body",
                    "closing",
                    "opening",
                    "props",
                    "entry",
                    "normal",
                    "count",
                    "defaults",
                    "shadowTag",
                ]);
                const name = string(element.name);
                if (!own(plan.components, name)) invalid();
                const light = template(element.body);
                const closing = string(element.closing);
                const opening = tag(element.opening);
                const props = array(element.props).map(prop => {
                    record(prop, 4);
                    const camel = string(prop[0]);
                    const none = string(prop[1]);
                    const group = prop[2] === null ? null : string(prop[2]);
                    const value = operand(prop[3]);
                    return (r, l, o) => [
                        o.strategy === "camelCase" ? camel : none,
                        group,
                        value(r, l),
                    ];
                });
                const entryAttrs = attrs(element.entry);
                const normalAttrs = attrs(element.normal);
                const bindings = count(element.count);
                const defaults = array(element.defaults).map(part => {
                    record(part, 2);
                    return { name: string(part[0]), run: attr(part[1]) };
                });
                const shadowTag = string(element.shadowTag);
                return (r, l, o, h, e) => {
                    if (!selected(o, name)) {
                        return opening(r, l, o, h) + light(r, l, o, h, e) + closing;
                    }
                    const component = components.get(name);
                    if (!component) missing(name);
                    const childRoot = props.length
                        ? child(
                              r,
                              props.map(prop => prop(r, l, o)),
                          )
                        : r;
                    const shadow = component.shadow(childRoot, null, o, scope(o), false);
                    let output = "";
                    let hydrationAttribute = null;
                    for (const part of e ? entryAttrs : normalAttrs) output += part(r, l);
                    if (!e && bindings && h) {
                        const hydration = marker(h, bindings);
                        hydrationAttribute = hydration.split("=")[0];
                        output += ` ${hydration}`;
                    }
                    for (const part of defaults) {
                        if (part.name !== hydrationAttribute) {
                            output += part.run(childRoot, null);
                        }
                    }
                    output += `>${shadowTag}${shadow}</template>`;
                    output += light(r, l, o, h, false);
                    return `${output}</${name}>`;
                };
            }
            default:
                invalid();
        }
    }
    function bodyOf(values) {
        const steps = array(values).map(operation);
        if (steps.length === 1 && values[0][0] === "literal") return steps[0];
        return (r, l, o, h, e) => {
            let output = "";
            for (const step of steps) output += step(r, l, o, h, e);
            return output;
        };
    }
    for (const name of templates.keys()) template(name);
    for (const [name, value] of Object.entries(plan.components)) {
        if (!name) invalid();
        fields(value, ["shadow", "host", "tag"]);
        components.set(name, {
            shadow: template(value.shadow),
            host: template(value.host),
            tag: string(value.tag),
        });
    }
    const body = bodyOf(plan.entry);
    return Object.freeze({
        components: Object.freeze([...components.keys()]),
        prepareState,
        renderEntry(state, options) {
            const [r, o] = request(state, options);
            return body(r, null, o, null, true);
        },
        renderTemplate(state, options) {
            const [r, o] = request(state, options);
            return body(r, null, o, null, false);
        },
        renderHost(name, state, options) {
            const [r, o] = request(state, options);
            const component = components.get(name);
            if (!component) missing(name);
            return component.host(r, null, o, null, true);
        },
        renderShadow(name, state, options) {
            const [r, o] = request(state, options);
            const component = components.get(name);
            if (!component) missing(name);
            return selected(o, name)
                ? component.tag +
                      component.shadow(r, null, o, scope(o), false) +
                      "</template>"
                : "";
        },
        renderEntryPrepared(state, options) {
            const [r, o] = preparedRequest(state, options);
            return body(r, null, o, null, true);
        },
        renderTemplatePrepared(state, options) {
            const [r, o] = preparedRequest(state, options);
            return body(r, null, o, null, false);
        },
        renderHostPrepared(name, state, options) {
            const [r, o] = preparedRequest(state, options);
            const component = components.get(name);
            if (!component) missing(name);
            return component.host(r, null, o, null, true);
        },
        renderShadowPrepared(name, state, options) {
            const [r, o] = preparedRequest(state, options);
            const component = components.get(name);
            if (!component) missing(name);
            return selected(o, name)
                ? component.tag +
                      component.shadow(r, null, o, scope(o), false) +
                      "</template>"
                : "";
        },
    });
}
