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

function normalizeJson(value, pending) {
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new TypeError("SSR state must contain finite numbers.");
        }
        return value === 0 ? 0 : value;
    }
    if (typeof value === "string" && !value.isWellFormed()) {
        throw new TypeError("SSR strings must contain well-formed Unicode.");
    }
    if (value !== null && typeof value === "object") pending.push(value);
    return value;
}

export function jsonRequest(json, options = {}) {
    if (typeof json !== "string") {
        throw new TypeError("SSR JSON input must be a string.");
    }
    // Only this boundary owns parsed data; live objects still use the full validator.
    const pending = [];
    const state = normalizeJson(JSON.parse(json), pending);
    while (pending.length) {
        const value = pending.pop();
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                value[index] = normalizeJson(value[index], pending);
            }
        } else {
            for (const key of Object.keys(value)) {
                if (!key.isWellFormed()) {
                    throw new TypeError(
                        "SSR property names must contain well-formed Unicode.",
                    );
                }
                value[key] = normalizeJson(value[key], pending);
            }
        }
    }
    return requestOptions(state, options);
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

function nested(value, path, start, indexes) {
    for (let index = start; index < path.length; index++) {
        const key = path[index];
        if (Array.isArray(value)) {
            if (key === "length") {
                return index === path.length - 1 ? value.length : undefined;
            }
            const arrayIndex = indexes[index];
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

function planChild(props, strategy) {
    // Authored assignment order fixes the first copy after each replacement at load time.
    const owned = new Set();
    const present = new Set();
    const steps = props.map(prop => {
        const key = prop[strategy];
        const getter = prop.value;
        if (prop.group === null) {
            present.add(key);
            owned.delete(key);
            return (root, loops, values) => {
                values[key] = getter(root, loops) ?? null;
            };
        }
        const inherit = !present.has(key);
        const copy = !owned.has(key);
        present.add(key);
        owned.add(key);
        const group = prop.group;
        const inherited = inherit ? access([key], []) : null;
        return (root, loops, values) => {
            const value = getter(root, loops);
            let current = inherited ? inherited(root) : values[key];
            if (copy && object(current)) {
                current = Object.assign(Object.create(null), current);
            }
            if (inherit && current === undefined) current = Object.create(null);
            if (object(current)) current[group] = value ?? null;
            values[key] = current;
        };
    });
    return (root, loops) => {
        const values = Object.create(null);
        for (const step of steps) step(root, loops, values);
        return { values, parent: object(root.values) ? root : null };
    };
}

function planComposite(parts) {
    if (parts.length === 0) return () => "";
    if (parts.length === 1) {
        const [part] = parts;
        return (r, l) => part(r, l) ?? null;
    }
    if (parts.length === 2) {
        const [first, second] = parts;
        return (r, l) => {
            const a = first(r, l);
            const b = second(r, l);
            return a == null || b == null ? null : a + b;
        };
    }
    if (parts.length === 3) {
        const [first, second, third] = parts;
        return (r, l) => {
            const a = first(r, l);
            const b = second(r, l);
            const c = third(r, l);
            return a == null || b == null || c == null ? null : a + b + c;
        };
    }
    return (r, l) => {
        let output = "";
        let missing = false;
        for (const part of parts) {
            const value = part(r, l);
            if (value == null) missing = true;
            else output += value;
        }
        return missing ? null : output;
    };
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
    const hostAttributes = new Map();
    for (const [name, reference] of Object.entries(plan.components)) {
        if (!name) invalid();
        string(reference);
        if (hostAttributes.has(reference)) continue;
        const ops = array(templates.get(reference));
        const metadata = ops[0]?.type === "host-attributes";
        if (metadata) fields(ops[0], ["type", "attributes"]);
        const body = ops.slice(metadata ? 1 : 0);
        if (
            body.length < 2 ||
            body[0]?.type !== "literal" ||
            body.at(-1)?.type !== "literal" ||
            body.at(-1).html !== "</template>"
        ) {
            invalid();
        }
        hostAttributes.set(reference, metadata ? array(ops[0].attributes) : []);
        templates.set(reference, body);
    }
    const aliases = [["$index"]];
    const path = value => {
        if (!array(value).length) invalid();
        return value.map(string);
    };
    let total = 0;
    for (const body of [plan.entry, ...templates.values()]) {
        for (const op of array(body)) {
            if (++total > 1_000_000) invalid();
            if (!object(op)) invalid();
            if (op.type === "repeat") {
                const name = path(op.alias);
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
        if (node?.type === "null") {
            fields(node, ["type"]);
            return () => null;
        }
        fields(node, ["type", "value"]);
        switch (node.type) {
            case "bool": {
                const value = boolean(node.value);
                return () => value;
            }
            case "string": {
                const value = string(node.value);
                return () => value;
            }
            case "number": {
                const encoded = string(node.value);
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
                const values = array(node.value).map(value => literal(value, depth + 1));
                return () => {
                    const result = [];
                    for (const value of values) result.push(value());
                    return result;
                };
            }
            case "object": {
                if (!object(node.value)) invalid();
                const values = Object.entries(node.value).map(([key, value]) => [
                    key,
                    literal(value, depth + 1),
                ]);
                return () => {
                    const result = {};
                    for (const [key, value] of values) {
                        const item = value();
                        if (key === "__proto__") {
                            Object.defineProperty(result, key, {
                                value: item,
                                enumerable: true,
                                configurable: true,
                                writable: true,
                            });
                        } else {
                            result[key] = item;
                        }
                    }
                    return result;
                };
            }
            default:
                invalid();
        }
    }
    function operand(node) {
        if (node?.type === "path") {
            fields(node, ["type", "path"]);
            return lookup(node.path);
        }
        if (node?.type === "value") {
            fields(node, ["type", "value"]);
            return literal(node.value);
        }
        invalid();
    }
    function condition(node, depth = 0) {
        if (depth > 64) invalid();
        if (!object(node)) invalid();
        if (node.type === "and" || node.type === "or") {
            fields(node, ["type", "left", "right"]);
            const left = condition(node.left, depth + 1);
            const right = condition(node.right, depth + 1);
            return node.type === "and"
                ? (r, l) => left(r, l) && right(r, l)
                : (r, l) => left(r, l) || right(r, l);
        }
        if (node.type === "not" || node.type === "truthy") {
            fields(node, ["type", "path"]);
            const value = lookup(node.path);
            return node.type === "not"
                ? (r, l) => !truthy(value(r, l))
                : (r, l) => truthy(value(r, l));
        }
        if (node.type === "compare") {
            fields(node, ["type", "operator", "path", "value"]);
            const operator = string(node.operator);
            if (!["==", "!=", ">", "<", ">=", "<="].includes(operator)) invalid();
            const left = lookup(node.path);
            const right = operand(node.value);
            return (r, l) => compare(left(r, l), right(r, l), operator);
        }
        invalid();
    }
    function attr(node) {
        if (!object(node)) invalid();
        switch (node.type) {
            case "literal": {
                fields(node, ["type", "html"]);
                const value = string(node.html);
                return () => value;
            }
            case "attribute": {
                fields(node, ["type", "name", "path", "boolean", "primitive"]);
                const name = string(node.name);
                const value = lookup(node.path);
                const isBoolean = boolean(node.boolean);
                const primitive = boolean(node.primitive);
                return (r, l) => attribute(name, value(r, l), isBoolean, primitive);
            }
            case "conditional": {
                fields(node, ["type", "condition", "html"]);
                const test = condition(node.condition);
                const value = string(node.html);
                return (r, l) => (test(r, l) ? value : "");
            }
            case "quoted": {
                fields(node, ["type", "name", "parts"]);
                const name = string(node.name);
                const parts = array(node.parts).map(part => {
                    if (part?.type === "literal") return attr(part);
                    fields(part, ["type", "path"]);
                    if (part.type !== "segment") invalid();
                    const value = lookup(part.path);
                    return (r, l) => segment(value(r, l));
                });
                const value = planComposite(parts);
                return (r, l) => quoted(name, value(r, l));
            }
            default:
                invalid();
        }
    }
    const attrs = values => array(values).map(attr);
    function tag(value, operation = false) {
        fields(
            value,
            operation
                ? ["type", "plain", "hydrated", "count", "ending"]
                : ["plain", "hydrated", "count", "ending"],
        );
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
        if (!object(node)) invalid();
        switch (node.type) {
            case "literal":
                return attr(node);
            case "template":
                fields(node, ["type", "name"]);
                return template(node.name);
            case "component": {
                fields(node, ["type", "name"]);
                const name = string(node.name);
                if (!own(plan.components, name)) invalid();
                return (r, l, o, h, e) => components.get(name).host(r, l, o, h, e);
            }
            case "tag":
                return tag(node, true);
            case "binding": {
                fields(node, ["type", "path", "escape"]);
                const value = lookup(node.path);
                const escaped = boolean(node.escape);
                return (r, l, o, h) => {
                    const index = h ? h.index++ : 0;
                    const output = text(value(r, l));
                    const content = escaped ? htmlEscape(output) : output;
                    return h ? start(h, index) + content + end(h, index) : content;
                };
            }
            case "when": {
                fields(node, ["type", "condition", "template"]);
                const test = condition(node.condition);
                const body = template(node.template);
                return (r, l, o, h) => {
                    const index = h ? h.index++ : 0;
                    const output = test(r, l)
                        ? body(r, l, o, h ? scope(o) : null, false)
                        : "";
                    return h ? start(h, index) + output + end(h, index) : output;
                };
            }
            case "repeat": {
                fields(node, ["type", "alias", "collection", "diagnostic", "template"]);
                const name = path(node.alias);
                const slot = aliases.findIndex(alias => samePath(alias, name));
                const value = lookup(node.collection);
                const expression = string(node.diagnostic);
                const body = template(node.template);
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
            case "element":
                return element(node, template(node.body));
            default:
                invalid();
        }
    }
    function defaultAttributes(values) {
        return array(values).map(part => {
            fields(part, ["name", "attribute"]);
            return { name: string(part.name), run: attr(part.attribute) };
        });
    }
    function element(value, light, hostDefaults) {
        const descriptor = fields(value, [
            "type",
            "name",
            "body",
            "closing",
            "opening",
            "props",
            "entry",
            "normal",
            "count",
            "defaults",
        ]);
        const name = string(descriptor.name);
        if (!own(plan.components, name)) invalid();
        const closing = string(descriptor.closing);
        const opening = tag(descriptor.opening);
        const props = array(descriptor.props).map(prop => {
            fields(prop, ["camelCase", "unchanged", "dataset", "value"]);
            const camel = string(prop.camelCase);
            const none = string(prop.unchanged);
            const group = prop.dataset === null ? null : string(prop.dataset);
            const value = operand(prop.value);
            return { camel, none, group, value };
        });
        const camelChild = props.length ? planChild(props, "camel") : null;
        const noneChild = props.every(prop => prop.camel === prop.none)
            ? camelChild
            : planChild(props, "none");
        const entryAttrs = attrs(descriptor.entry);
        const normalAttrs = attrs(descriptor.normal);
        const bindings = count(descriptor.count);
        const defaults = hostDefaults ?? defaultAttributes(descriptor.defaults);
        return (r, l, o, h, e) => {
            if (!selected(o, name)) {
                return opening(r, l, o, h) + light(r, l, o, h, e) + closing;
            }
            const component = components.get(name);
            if (!component) missing(name);
            const makeChild = o.strategy === "camelCase" ? camelChild : noneChild;
            const childRoot = makeChild ? makeChild(r, l) : r;
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
            output += `>${shadow}`;
            output += light(r, l, o, h, false);
            return `${output}</${name}>`;
        };
    }
    function bodyOf(values) {
        const steps = array(values).map(operation);
        if (steps.length === 1 && values[0].type === "literal") return steps[0];
        return (r, l, o, h, e) => {
            let output = "";
            for (const step of steps) output += step(r, l, o, h, e);
            return output;
        };
    }
    for (const name of templates.keys()) template(name);
    const compiledHostAttributes = new Map(
        [...hostAttributes].map(([reference, values]) => [
            reference,
            defaultAttributes(values),
        ]),
    );
    for (const [name, reference] of Object.entries(plan.components)) {
        const base = [{ type: "literal", html: `<${name}` }];
        const opening = [{ type: "literal", html: `<${name}>` }];
        components.set(name, {
            shadow: template(reference),
            host: element(
                {
                    type: "element",
                    name,
                    body: null,
                    closing: `</${name}>`,
                    opening: { plain: opening, hydrated: opening, count: 0, ending: ">" },
                    props: [],
                    entry: base,
                    normal: base,
                    count: 0,
                    defaults: hostAttributes.get(reference),
                },
                () => "",
                compiledHostAttributes.get(reference),
            ),
        });
    }
    const body = bodyOf(plan.entry);
    function renderMethods(read, suffix = "") {
        return {
            [`renderEntry${suffix}`](state, options) {
                const [r, o] = read(state, options);
                return body(r, null, o, null, true);
            },
            [`renderTemplate${suffix}`](state, options) {
                const [r, o] = read(state, options);
                return body(r, null, o, null, false);
            },
            [`renderHost${suffix}`](name, state, options) {
                const [r, o] = read(state, options);
                const component = components.get(name);
                if (!component) missing(name);
                return component.host(r, null, o, null, true);
            },
            [`renderShadow${suffix}`](name, state, options) {
                const [r, o] = read(state, options);
                const component = components.get(name);
                if (!component) missing(name);
                return selected(o, name)
                    ? component.shadow(r, null, o, scope(o), false)
                    : "";
            },
        };
    }
    return Object.freeze({
        components: Object.freeze([...components.keys()]),
        prepareState,
        ...renderMethods(request),
        ...renderMethods(jsonRequest, "Json"),
        ...renderMethods(preparedRequest, "Prepared"),
    });
}
