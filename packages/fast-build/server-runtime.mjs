export const runtimeVersion = 1;

const own = (value, key) => Object.hasOwn(value, key);
const object = value =>
    value !== null && typeof value === "object" && !Array.isArray(value);

function validate(value, ancestors = new Set()) {
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
        const normalized = validate(descriptor.value, ancestors);
        if (!Object.is(normalized, descriptor.value)) {
            (changes ??= []).push([key, normalized]);
        }
    }
    ancestors.delete(value);
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

export function request(state = {}, options = {}) {
    state = validate(state);
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

function nested(value, path) {
    for (let index = 0; index < path.length; index++) {
        const key = path[index];
        if (Array.isArray(value)) {
            if (key === "length") {
                return index === path.length - 1 ? value.length : undefined;
            }
            if (!/^\+?\d+$/.test(key)) {
                return undefined;
            }
            const arrayIndex = Number(key);
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

export function get(root, loops, path) {
    for (let index = loops.length - 1; index >= 0; index--) {
        const [name, value] = loops[index];
        if (
            name.length <= path.length &&
            name.every((segment, index) => segment === path[index])
        ) {
            return nested(value, path.slice(name.length));
        }
    }
    for (let frame = root; frame; frame = frame.parent) {
        const value = nested(frame.values, path);
        if (value !== undefined || (object(frame.values) && own(frame.values, path[0]))) {
            return value;
        }
    }
}

export function child(root, entries) {
    const values = Object.create(null);
    for (const [key, group, value] of entries) {
        if (group === null) {
            values[key] = value === undefined ? null : value;
        } else {
            if (!own(values, key)) {
                const inherited = get(root, [], [key]);
                values[key] = inherited === undefined ? Object.create(null) : inherited;
                if (object(values[key])) {
                    values[key] = Object.assign(Object.create(null), values[key]);
                }
            }
            if (object(values[key])) {
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

export const htmlEscape = value =>
    value.replace(/[&<>"']/g, character => {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        }[character];
    });

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
        /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
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
