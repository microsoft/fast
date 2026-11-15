export const runtimeVersion = 5;

const parseJson = JSON.parse;
const own = (value, key) => Object.hasOwn(value, key);
const object = value =>
    value !== null && typeof value === "object" && !Array.isArray(value);

function normalizeJson(value) {
    if (typeof value === "string") {
        if (!value.isWellFormed()) {
            throw new TypeError("SSR strings must contain well-formed Unicode.");
        }
    } else if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new TypeError("SSR state must be acyclic JSON-shaped data.");
        }
        return value === 0 ? 0 : value;
    } else if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
            const item = value[index];
            normalizeJson(item);
            if (Object.is(item, -0)) value[index] = 0;
        }
    } else if (value !== null && typeof value === "object") {
        for (const key of Object.keys(value)) {
            if (!key.isWellFormed()) {
                throw new TypeError(
                    "SSR property names must contain well-formed Unicode.",
                );
            }
            const item = value[key];
            normalizeJson(item);
            if (Object.is(item, -0)) value[key] = 0;
        }
    }
    return value;
}

export function jsonRequest(json, options = {}) {
    if (typeof json !== "string") {
        throw new TypeError("Expected SSR state as a JSON string.");
    }
    return requestOptions(normalizeJson(parseJson(json)), options);
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

function planChild(props, strategy) {
    const keys = props.map(prop => prop[strategy]);
    if (props.every(prop => prop.group === null)) {
        const getters = props.map(prop => prop.value);
        return (root, loops) => {
            const values = Object.create(null);
            for (let index = 0; index < keys.length; index++) {
                values[keys[index]] = getters[index](root, loops) ?? null;
            }
            return { values, parent: object(root.values) ? root : null };
        };
    }
    const slots = new Map();
    for (let index = 0; index < props.length; index++) {
        if (props[index].group !== null && !slots.has(keys[index])) {
            slots.set(keys[index], slots.size);
        }
    }
    const steps = props.map((prop, index) => {
        const key = keys[index];
        const slot = slots.get(key);
        const getter = prop.value;
        if (prop.group === null) {
            return (root, loops, values, copied) => {
                values[key] = getter(root, loops) ?? null;
                if (copied && slot !== undefined) copied[slot] = false;
                return copied;
            };
        }
        const inherited = access([key], []);
        const group = prop.group;
        return (root, loops, values, copied) => {
            const value = getter(root, loops);
            if (!own(values, key)) {
                const initial = inherited(root);
                values[key] = initial === undefined ? Object.create(null) : initial;
            }
            if (object(values[key])) {
                if (!copied?.[slot]) {
                    values[key] = Object.assign(Object.create(null), values[key]);
                    (copied ??= [])[slot] = true;
                }
                values[key][group] = value ?? null;
            }
            return copied;
        };
    });
    return (root, loops) => {
        const values = Object.create(null);
        let copied;
        for (const step of steps) copied = step(root, loops, values, copied);
        return { values, parent: object(root.values) ? root : null };
    };
}

function planComposite(parts) {
    if (parts.length === 0) return () => "";
    if (parts.length === 1) return (r, l) => parts[0](r, l) ?? null;
    if (parts.length === 2) {
        const [first, second] = parts;
        return (r, l) => {
            const a = first(r, l);
            const b = second(r, l);
            return a === null || a === undefined || b === null || b === undefined
                ? null
                : a + b;
        };
    }
    if (parts.length === 3) {
        const [first, second, third] = parts;
        return (r, l) => {
            const a = first(r, l);
            const b = second(r, l);
            const c = third(r, l);
            return a === null ||
                a === undefined ||
                b === null ||
                b === undefined ||
                c === null ||
                c === undefined
                ? null
                : a + b + c;
        };
    }
    return (r, l) => {
        let output = "";
        let missing = false;
        for (const part of parts) {
            const value = part(r, l);
            if (value === null || value === undefined) missing = true;
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
 * Load compiler-owned flat tables once, without evaluating generated source.
 * Application state is supplied only to the returned render methods.
 */
export function createServerRenderer(entry, definitions, compilerId) {
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

    function load(plan) {
        if (
            plan?.format !== "fast-server-plan" ||
            plan.version !== 1 ||
            !Array.isArray(plan.strings) ||
            plan.strings.some(value => typeof value !== "string") ||
            !Array.isArray(plan.code) ||
            !plan.code.every(Number.isSafeInteger) ||
            !Array.isArray(plan.offsets) ||
            plan.offsets.length === 0 ||
            plan.offsets[0] !== 0 ||
            plan.offsets.some(
                (offset, index) =>
                    !Number.isSafeInteger(offset) ||
                    offset < 0 ||
                    offset >= plan.code.length ||
                    (index > 0 && offset <= plan.offsets[index - 1]),
            )
        ) {
            invalid();
        }
        const strings = plan.strings.slice();
        const rows = plan.offsets.map((offset, index) =>
            plan.code.slice(offset, plan.offsets[index + 1]),
        );
        const row = (id, kinds) => {
            if (
                !Number.isSafeInteger(id) ||
                id < 0 ||
                id >= rows.length ||
                (kinds && !kinds.includes(rows[id][0]))
            ) {
                invalid();
            }
            return rows[id];
        };
        const string = id => {
            if (id < 0 || id >= strings.length) invalid();
            return strings[id];
        };
        const path = id => row(id, [1]).slice(1).map(string);
        const aliases = [["$index"]];
        for (const operation of rows) {
            if (operation[0] === 22) {
                const name = path(operation[1]);
                if (
                    !aliases.some(
                        alias =>
                            alias.length === name.length &&
                            alias.every((segment, index) => segment === name[index]),
                    )
                ) {
                    aliases.push(name);
                }
            }
        }
        const conditions = [8, 9, 10, 11, 12];
        const operands = [1, 2, 3, 4, 5, 6, 7];
        const attrs = [0, 13, 14, 15, 16];
        const operations = [0, 19, 20, 21, 22, 23, 26];
        const lengths = {
            0: 1,
            2: 0,
            3: 1,
            4: 1,
            5: 1,
            8: 1,
            9: 1,
            10: 2,
            11: 2,
            12: 3,
            13: 4,
            14: 2,
            15: 1,
            16: 2,
            19: 4,
            20: 2,
            21: 2,
            22: 4,
            23: 10,
            24: 4,
            25: 2,
            26: 1,
        };
        const compiled = new Map();
        const visiting = new Set();
        const boolean = value => {
            if (value !== 0 && value !== 1) invalid();
            return value === 1;
        };
        const count = value => {
            if (value < 0) invalid();
            return value;
        };
        const refs = (id, kinds) =>
            row(id, [17])
                .slice(1)
                .map(reference => build(reference, kinds));

        function build(id, kinds) {
            const [kind, ...args] = row(id, kinds);
            if (compiled.has(id)) return compiled.get(id);
            if (visiting.has(id)) invalid();
            visiting.add(id);
            if (own(lengths, kind) && args.length !== lengths[kind]) invalid();
            let run;
            switch (kind) {
                case 0:
                case 5: {
                    const value = string(args[0]);
                    run = () => value;
                    break;
                }
                case 1: {
                    if (args.length === 0) invalid();
                    const segments = args.map(string);
                    const slots = aliases.flatMap((alias, slot) =>
                        alias.length <= segments.length &&
                        alias.every((segment, index) => segment === segments[index])
                            ? [[slot, alias.length]]
                            : [],
                    );
                    run = access(segments, slots);
                    break;
                }
                case 2:
                    run = () => null;
                    break;
                case 3: {
                    const value = boolean(args[0]);
                    run = () => value;
                    break;
                }
                case 4: {
                    const encoded = string(args[0]);
                    const value =
                        encoded === "inf"
                            ? Infinity
                            : encoded === "-inf"
                              ? -Infinity
                              : Number(encoded);
                    if (Number.isNaN(value) && encoded !== "NaN") invalid();
                    run = () => value;
                    break;
                }
                case 6: {
                    const values = args.map(reference => build(reference, operands));
                    run = (r, l) => values.map(value => value(r, l));
                    break;
                }
                case 7: {
                    if (args.length % 2 !== 0) invalid();
                    const entries = [];
                    for (let index = 0; index < args.length; index += 2) {
                        entries.push([
                            string(args[index]),
                            build(args[index + 1], operands),
                        ]);
                    }
                    run = (r, l) =>
                        Object.fromEntries(
                            entries.map(([key, value]) => [key, value(r, l)]),
                        );
                    break;
                }
                case 8:
                case 9: {
                    const value = build(args[0], [1]);
                    run =
                        kind === 8
                            ? (r, l) => !truthy(value(r, l))
                            : (r, l) => truthy(value(r, l));
                    break;
                }
                case 10:
                case 11: {
                    const left = build(args[0], conditions);
                    const right = build(args[1], conditions);
                    run =
                        kind === 10
                            ? (r, l) => left(r, l) && right(r, l)
                            : (r, l) => left(r, l) || right(r, l);
                    break;
                }
                case 12: {
                    const operator = string(args[0]);
                    if (!["==", "!=", ">", "<", ">=", "<="].includes(operator)) {
                        invalid();
                    }
                    const left = build(args[1], [1]);
                    const right = build(args[2], operands);
                    run = (r, l) => compare(left(r, l), right(r, l), operator);
                    break;
                }
                case 13: {
                    const name = string(args[0]);
                    const value = build(args[1], [1]);
                    const isBoolean = boolean(args[2]);
                    const primitive = boolean(args[3]);
                    run = (r, l) => attribute(name, value(r, l), isBoolean, primitive);
                    break;
                }
                case 14: {
                    const condition = build(args[0], conditions);
                    const literal = string(args[1]);
                    run = (r, l) => (condition(r, l) ? literal : "");
                    break;
                }
                case 15: {
                    const value = build(args[0], [1]);
                    run = (r, l) => segment(value(r, l));
                    break;
                }
                case 16: {
                    const name = string(args[0]);
                    const value = planComposite(refs(args[1], attrs));
                    run = (r, l) => quoted(name, value(r, l));
                    break;
                }
                case 17: {
                    const values = args.map(reference => build(reference));
                    run = (r, l, o, h, e) => values.map(value => value(r, l, o, h, e));
                    break;
                }
                case 18: {
                    const steps = args.map(reference => build(reference, operations));
                    if (steps.length === 1 && row(args[0])[0] === 0) {
                        run = steps[0];
                    } else {
                        run = (r, l, o, h, e) => {
                            let output = "";
                            for (const step of steps) output += step(r, l, o, h, e);
                            return output;
                        };
                    }
                    break;
                }
                case 19: {
                    const plain = refs(args[0], attrs);
                    const hydrated = refs(args[1], attrs);
                    const bindings = count(args[2]);
                    const ending = string(args[3]);
                    run = (r, l, o, h) => {
                        let output = "";
                        for (const part of h ? hydrated : plain) output += part(r, l);
                        if (h && bindings) output += ` ${marker(h, bindings)}${ending}`;
                        return output;
                    };
                    break;
                }
                case 20: {
                    const value = build(args[0], [1]);
                    const escaped = boolean(args[1]);
                    run = (r, l, o, h) => {
                        const index = h ? h.index++ : 0;
                        const output = text(value(r, l));
                        const content = escaped ? htmlEscape(output) : output;
                        return h ? start(h, index) + content + end(h, index) : content;
                    };
                    break;
                }
                case 21: {
                    const condition = build(args[0], conditions);
                    const body = build(args[1], [18]);
                    run = (r, l, o, h) => {
                        const index = h ? h.index++ : 0;
                        const output = condition(r, l)
                            ? body(r, l, o, h ? scope(o) : null, false)
                            : "";
                        return h ? start(h, index) + output + end(h, index) : output;
                    };
                    break;
                }
                case 22: {
                    const name = path(args[0]);
                    const slot = aliases.findIndex(
                        alias =>
                            alias.length === name.length &&
                            alias.every((segment, index) => segment === name[index]),
                    );
                    const value = build(args[1], [1]);
                    const expression = string(args[2]);
                    const body = build(args[3], [18]);
                    run = (r, l, o, h) => {
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
                    break;
                }
                case 23: {
                    const name = string(args[0]);
                    const light = build(args[1], [18]);
                    const closing = string(args[2]);
                    const opening = build(args[3], [19]);
                    const props = refs(args[4], [24]);
                    const camelChild = props.length ? planChild(props, "camel") : null;
                    const noneChild = props.every(prop => prop.camel === prop.none)
                        ? camelChild
                        : planChild(props, "none");
                    const entryAttrs = refs(args[5], attrs);
                    const normalAttrs = refs(args[6], attrs);
                    const bindings = count(args[7]);
                    const defaults = refs(args[8], [25]);
                    const shadowTag = string(args[9]);
                    run = (r, l, o, h, e) => {
                        if (!selected(o, name)) {
                            return opening(r, l, o, h) + light(r, l, o, h, e) + closing;
                        }
                        const component = components.get(name);
                        if (!component) missing(name);
                        const makeChild =
                            o.strategy === "camelCase" ? camelChild : noneChild;
                        const childRoot = makeChild ? makeChild(r, l) : r;
                        const shadow = component.shadow(
                            childRoot,
                            null,
                            o,
                            scope(o),
                            false,
                        );
                        let output = "";
                        let hydrationAttribute = null;
                        for (const part of e ? entryAttrs : normalAttrs) {
                            output += part(r, l);
                        }
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
                    break;
                }
                case 24: {
                    const camel = string(args[0]);
                    const none = string(args[1]);
                    const group = args[2] === -1 ? null : string(args[2]);
                    const value = build(args[3], operands);
                    run = { camel, none, group, value };
                    break;
                }
                case 25:
                    run = {
                        name: string(args[0]),
                        run: build(args[1], attrs),
                    };
                    break;
                case 26:
                    run = build(args[0], [18]);
                    break;
                default:
                    invalid();
            }
            visiting.delete(id);
            compiled.set(id, run);
            return run;
        }

        // Validate even unreachable records before activating an asset.
        for (let id = 0; id < rows.length; id++) build(id);
        return {
            shadow: build(plan.root, [18]),
            host: plan.host === undefined ? null : build(plan.host, [18]),
            tag: plan.tag === undefined ? null : string(plan.tag),
        };
    }

    if (!Array.isArray(definitions) || typeof compilerId !== "string") invalid();
    for (const [name, plan] of definitions) {
        if (typeof name !== "string" || components.has(name)) invalid();
        const component = load(plan);
        if (!component.host || component.tag === null) invalid();
        components.set(name, component);
    }
    const body = load(entry).shadow;
    return Object.freeze({
        compilerId,
        runtimeVersion,
        components: Object.freeze([...components.keys()]),
        renderEntryJson(json, options) {
            const [r, o] = jsonRequest(json, options);
            return body(r, null, o, null, true);
        },
        renderTemplateJson(json, options) {
            const [r, o] = jsonRequest(json, options);
            return body(r, null, o, null, false);
        },
        renderHostJson(name, json, options) {
            const [r, o] = jsonRequest(json, options);
            const component = components.get(name);
            if (!component) missing(name);
            return component.host(r, null, o, null, true);
        },
        renderShadowJson(name, json, options) {
            const [r, o] = jsonRequest(json, options);
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
