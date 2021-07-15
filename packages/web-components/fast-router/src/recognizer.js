var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { QueryString } from "./query-string";
const defaultParameterConverter = value => value;
/**
 * @alpha
 */
export class ConfigurableRoute {
    constructor(path, name, caseSensitive) {
        this.path = path;
        this.name = name;
        this.caseSensitive = caseSensitive;
    }
}
/**
 * @alpha
 */
export class Endpoint {
    constructor(route, paramNames, paramTypes, settings) {
        this.route = route;
        this.paramNames = paramNames;
        this.paramTypes = paramTypes;
        this.settings = settings;
    }
    get path() {
        return this.route.path;
    }
}
/**
 * @alpha
 */
export class RecognizedRoute {
    constructor(endpoint, params, typedParams, queryParams) {
        this.endpoint = endpoint;
        this.params = params;
        this.typedParams = typedParams;
        this.queryParams = queryParams;
        this.allParams = Object.assign(Object.assign({}, params), queryParams);
        this.allTypedParams = Object.assign(Object.assign({}, typedParams), queryParams);
    }
    get settings() {
        return this.endpoint.settings;
    }
}
class Candidate {
    constructor(chars, states, skippedStates, result) {
        var _a;
        this.chars = chars;
        this.states = states;
        this.skippedStates = skippedStates;
        this.result = result;
        this.head = states[states.length - 1];
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        this.endpoint = (_a = this.head) === null || _a === void 0 ? void 0 : _a.endpoint;
    }
    advance(ch) {
        const { chars, states, skippedStates, result } = this;
        let stateToAdd = null;
        let matchCount = 0;
        const state = states[states.length - 1];
        function $process(nextState, skippedState) {
            if (nextState.isMatch(ch)) {
                if (++matchCount === 1) {
                    stateToAdd = nextState;
                } else {
                    result.add(
                        new Candidate(
                            chars.concat(ch),
                            states.concat(nextState),
                            skippedState === null
                                ? skippedStates
                                : skippedStates.concat(skippedState),
                            result
                        )
                    );
                }
            }
            if (
                state.segment === null &&
                nextState.isOptional &&
                nextState.nextStates !== null
            ) {
                if (nextState.nextStates.length > 1) {
                    throw new Error(`${nextState.nextStates.length} nextStates`);
                }
                const separator = nextState.nextStates[0];
                if (!separator.isSeparator) {
                    throw new Error(`Not a separator`);
                }
                if (separator.nextStates !== null) {
                    for (const $nextState of separator.nextStates) {
                        $process($nextState, nextState);
                    }
                }
            }
        }
        if (state.isDynamic) {
            $process(state, null);
        }
        if (state.nextStates !== null) {
            for (const nextState of state.nextStates) {
                $process(nextState, null);
            }
        }
        if (stateToAdd !== null) {
            states.push((this.head = stateToAdd));
            chars.push(ch);
            if (stateToAdd.endpoint !== null) {
                this.endpoint = stateToAdd.endpoint;
            }
        }
        if (matchCount === 0) {
            result.remove(this);
        }
    }
    finalize() {
        function collectSkippedStates(skippedStates, state) {
            const nextStates = state.nextStates;
            if (nextStates !== null) {
                if (nextStates.length === 1 && nextStates[0].segment === null) {
                    collectSkippedStates(skippedStates, nextStates[0]);
                } else {
                    for (const nextState of nextStates) {
                        if (nextState.isOptional && nextState.endpoint !== null) {
                            skippedStates.push(nextState);
                            if (nextState.nextStates !== null) {
                                for (const $nextState of nextState.nextStates) {
                                    collectSkippedStates(skippedStates, $nextState);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        collectSkippedStates(this.skippedStates, this.head);
    }
    getParams() {
        const { states, chars, endpoint } = this;
        const params = {};
        // First initialize all properties with undefined so they all exist (even if they're not filled, e.g. non-matched optional params)
        for (const name of endpoint.paramNames) {
            params[name] = void 0;
        }
        for (let i = 0, ii = states.length; i < ii; ++i) {
            const state = states[i];
            if (state.isDynamic) {
                const name = state.segment.name;
                if (params[name] === void 0) {
                    params[name] = chars[i];
                } else {
                    params[name] += chars[i];
                }
            }
        }
        return params;
    }
    /**
     * Compares this candidate to another candidate to determine the correct sorting order.
     *
     * This algorithm is different from `sortSolutions` in v1's route-recognizer in that it compares
     * the candidates segment-by-segment, rather than merely comparing the cumulative of segment types
     *
     * This resolves v1's ambiguity in situations like `/foo/:id/bar` vs. `/foo/bar/:id`, which had the
     * same sorting value because they both consist of two static segments and one dynamic segment.
     *
     * With this algorithm, `/foo/bar/:id` would always be sorted first because the second segment is different,
     * and static wins over dynamic.
     *
     * ### NOTE
     * This algorithm violates some of the invariants of v1's algorithm,
     * but those invariants were arguably not very sound to begin with. Example:
     *
     * `/foo/*path/bar/baz` vs. `/foo/bar/*path1/*path2`
     * - in v1, the first would win because that match has fewer stars
     * - in v2, the second will win because there is a bigger static match at the start of the pattern
     *
     * The algorithm should be more logical and easier to reason about in v2, but it's important to be aware of
     * subtle difference like this which might surprise some users who happened to rely on this behavior from v1,
     * intentionally or unintentionally.
     *
     * @param b - The candidate to compare this to.
     * Parameter name is `b` because the method should be used like so: `states.sort((a, b) => a.compareTo(b))`.
     * This will bring the candidate with the highest score to the first position of the array.
     */
    compareTo(b) {
        const statesA = this.states;
        const statesB = b.states;
        for (
            let iA = 0, iB = 0, ii = Math.max(statesA.length, statesB.length);
            iA < ii;
            ++iA
        ) {
            let stateA = statesA[iA];
            if (stateA === void 0) {
                return 1;
            }
            let stateB = statesB[iB];
            if (stateB === void 0) {
                return -1;
            }
            let segmentA = stateA.segment;
            let segmentB = stateB.segment;
            if (segmentA === null) {
                if (segmentB === null) {
                    ++iB;
                    continue;
                }
                if ((stateA = statesA[++iA]) === void 0) {
                    return 1;
                }
                segmentA = stateA.segment;
            } else if (segmentB === null) {
                if ((stateB = statesB[++iB]) === void 0) {
                    return -1;
                }
                segmentB = stateB.segment;
            }
            if (segmentA.kind < segmentB.kind) {
                return 1;
            }
            if (segmentA.kind > segmentB.kind) {
                return -1;
            }
            ++iB;
        }
        const skippedStatesA = this.skippedStates;
        const skippedStatesB = b.skippedStates;
        const skippedStatesALen = skippedStatesA.length;
        const skippedStatesBLen = skippedStatesB.length;
        if (skippedStatesALen < skippedStatesBLen) {
            return 1;
        }
        if (skippedStatesALen > skippedStatesBLen) {
            return -1;
        }
        for (let i = 0; i < skippedStatesALen; ++i) {
            const skippedStateA = skippedStatesA[i];
            const skippedStateB = skippedStatesB[i];
            if (skippedStateA.length < skippedStateB.length) {
                return 1;
            }
            if (skippedStateA.length > skippedStateB.length) {
                return -1;
            }
        }
        // This should only be possible with a single pattern with multiple consecutive star segments.
        // TODO: probably want to warn or even throw here, but leave it be for now.
        return 0;
    }
}
function hasEndpoint(candidate) {
    return candidate.head.endpoint !== null;
}
function compareChains(a, b) {
    return a.compareTo(b);
}
class RecognizeResult {
    constructor(rootState) {
        this.candidates = [];
        this.candidates = [new Candidate([""], [rootState], [], this)];
    }
    get isEmpty() {
        return this.candidates.length === 0;
    }
    getSolution() {
        const candidates = this.candidates.filter(hasEndpoint);
        if (candidates.length === 0) {
            return null;
        }
        for (const candidate of candidates) {
            candidate.finalize();
        }
        candidates.sort(compareChains);
        return candidates[0];
    }
    add(candidate) {
        this.candidates.push(candidate);
    }
    remove(candidate) {
        this.candidates.splice(this.candidates.indexOf(candidate), 1);
    }
    advance(ch) {
        const candidates = this.candidates.slice();
        for (const candidate of candidates) {
            candidate.advance(ch);
        }
    }
}
/**
 * @alpha
 */
export class DefaultRouteRecognizer {
    constructor() {
        this.names = new Map();
        this.paths = new Map();
        this.rootState = new State(null, null, "");
    }
    add(routeOrRoutes, settings) {
        if (routeOrRoutes instanceof Array) {
            for (const route of routeOrRoutes) {
                this.$add(route, settings);
            }
        } else {
            this.$add(routeOrRoutes, settings);
        }
    }
    $add(route, settings) {
        const path = route.path;
        const $route = new ConfigurableRoute(
            route.path,
            route.name || "",
            route.caseSensitive === true
        );
        // Normalize leading, trailing and double slashes by ignoring empty segments
        const parts = path === "" ? [""] : path.split("/").filter(isNotEmpty);
        const paramNames = [];
        const paramTypes = [];
        let state = this.rootState;
        let segments = [];
        for (const part of parts) {
            // Each segment always begins with a slash, so we represent this with a non-segment state
            state = state.append(null, "/");
            switch (part.charAt(0)) {
                case "{": {
                    // route parameter
                    const nameAndType = part
                        .slice(1, -1)
                        .split(":")
                        .map(x => x.trim());
                    if (nameAndType.length === 2) {
                        paramTypes.push(nameAndType[1]);
                    } else {
                        paramTypes.push("string");
                    }
                    const isOptional = nameAndType[0].endsWith("?");
                    const name = isOptional
                        ? nameAndType[0].slice(0, -1)
                        : nameAndType[0];
                    paramNames.push(name);
                    const segment = new DynamicSegment(name, isOptional);
                    segments.push(segment);
                    state = segment.appendTo(state);
                    break;
                }
                case "*": {
                    // dynamic route
                    const name = part.slice(1);
                    paramNames.push(name);
                    paramTypes.push("string");
                    const segment = new StarSegment(name);
                    segments.push(segment);
                    state = segment.appendTo(state);
                    break;
                }
                default: {
                    // standard path route
                    const segment = new StaticSegment(part, $route.caseSensitive);
                    segments.push(segment);
                    state = segment.appendTo(state);
                    break;
                }
            }
        }
        const endpoint = new Endpoint($route, paramNames, paramTypes, settings || null);
        state.setEndpoint(endpoint);
        this.paths.set(path, segments);
        if (route.name) {
            this.names.set(route.name, segments);
        }
    }
    recognize(path, converters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const separated = QueryString.separate(path);
            const queryParams = QueryString.parse(separated.queryString);
            path = decodeURI(separated.path);
            if (!path.startsWith("/")) {
                path = `/${path}`;
            }
            if (path.length > 1 && path.endsWith("/")) {
                path = path.slice(0, -1);
            }
            const result = new RecognizeResult(this.rootState);
            for (let i = 0, ii = path.length; i < ii; ++i) {
                const ch = path.charAt(i);
                result.advance(ch);
                if (result.isEmpty) {
                    return null;
                }
            }
            const candidate = result.getSolution();
            if (candidate === null) {
                return null;
            }
            const { endpoint } = candidate;
            const paramNames = endpoint.paramNames;
            const paramTypes = endpoint.paramTypes;
            const params = candidate.getParams();
            const typedParams = {};
            for (let i = 0, ii = paramNames.length; i < ii; ++i) {
                const name = paramNames[i];
                const convert = converters[paramTypes[i]] || defaultParameterConverter;
                const untypedValue = params[name];
                const typedValue = yield convert(untypedValue);
                typedParams[name] = typedValue;
            }
            return new RecognizedRoute(endpoint, params, typedParams, queryParams);
        });
    }
    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name - The name of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateFromName(name, params) {
        return this.generate(this.names.get(name), params);
    }
    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path - The path of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateFromPath(path, params) {
        return this.generate(this.paths.get(path), params);
    }
    generate(segments, params) {
        if (!segments) {
            return null;
        }
        const routeParams = Object.assign({}, params);
        const consumed = {};
        let output = "";
        for (let i = 0, l = segments.length; i < l; i++) {
            const segment = segments[i];
            const segmentValue = segment.generate(routeParams, consumed);
            if (segmentValue === null || segmentValue === undefined) {
                if (segment instanceof DynamicSegment && !segment.optional) {
                    throw new Error(
                        `A value is required for route parameter '${segment.name}'.`
                    );
                }
            } else {
                output += "/";
                output += segmentValue;
            }
        }
        if (output.charAt(0) !== "/") {
            output = "/" + output;
        }
        // remove params used in the path and add the rest to the querystring
        for (let param in consumed) {
            delete routeParams[param];
        }
        const queryString = QueryString.build(routeParams);
        output += queryString ? `?${queryString}` : "";
        return output;
    }
}
class State {
    constructor(prevState, segment, value) {
        this.prevState = prevState;
        this.segment = segment;
        this.value = value;
        this.nextStates = null;
        this.endpoint = null;
        switch (segment === null || segment === void 0 ? void 0 : segment.kind) {
            case 2 /* dynamic */:
                this.length = prevState.length + 1;
                this.isSeparator = false;
                this.isDynamic = true;
                this.isOptional = segment.optional;
                break;
            case 1 /* star */:
                this.length = prevState.length + 1;
                this.isSeparator = false;
                this.isDynamic = true;
                this.isOptional = false;
                break;
            case 3 /* static */:
                this.length = prevState.length + 1;
                this.isSeparator = false;
                this.isDynamic = false;
                this.isOptional = false;
                break;
            case undefined:
                this.length = prevState === null ? 0 : prevState.length;
                this.isSeparator = true;
                this.isDynamic = false;
                this.isOptional = false;
                break;
        }
    }
    append(segment, value) {
        let state;
        let nextStates = this.nextStates;
        if (nextStates === null) {
            state = void 0;
            nextStates = this.nextStates = [];
        } else if (segment === null) {
            state = nextStates.find(s => s.value === value);
        } else {
            state = nextStates.find(s => {
                var _a;
                return (_a = s.segment) === null || _a === void 0
                    ? void 0
                    : _a.equals(segment);
            });
        }
        if (state === void 0) {
            nextStates.push((state = new State(this, segment, value)));
        }
        return state;
    }
    setEndpoint(endpoint) {
        if (this.endpoint !== null) {
            throw new Error(
                `Cannot add ambiguous route. The pattern '${endpoint.route.path}' clashes with '${this.endpoint.route.path}'`
            );
        }
        this.endpoint = endpoint;
        if (this.isOptional) {
            this.prevState.setEndpoint(endpoint);
            if (this.prevState.isSeparator && this.prevState.prevState !== null) {
                this.prevState.prevState.setEndpoint(endpoint);
            }
        }
    }
    isMatch(ch) {
        const segment = this.segment;
        switch (segment === null || segment === void 0 ? void 0 : segment.kind) {
            case 2 /* dynamic */:
                return !this.value.includes(ch);
            case 1 /* star */:
                return true;
            case 3 /* static */:
            case undefined:
                // segment separators (slashes) are non-segments. We could say return ch === '/' as well, technically.
                return this.value.includes(ch);
        }
    }
}
function isNotEmpty(segment) {
    return segment.length > 0;
}
class StaticSegment {
    constructor(value, caseSensitive) {
        this.value = value;
        this.caseSensitive = caseSensitive;
    }
    get kind() {
        return 3 /* static */;
    }
    appendTo(state) {
        const {
            value,
            value: { length },
        } = this;
        if (this.caseSensitive) {
            for (let i = 0; i < length; ++i) {
                state = state.append(/* segment */ this, /* value   */ value.charAt(i));
            }
        } else {
            for (let i = 0; i < length; ++i) {
                const ch = value.charAt(i);
                state = state.append(
                    /* segment */ this,
                    /* value   */ ch.toUpperCase() + ch.toLowerCase()
                );
            }
        }
        return state;
    }
    generate() {
        return this.value;
    }
    equals(b) {
        return (
            b.kind === 3 /* static */ &&
            b.caseSensitive === this.caseSensitive &&
            b.value === this.value
        );
    }
}
class DynamicSegment {
    constructor(name, optional) {
        this.name = name;
        this.optional = optional;
    }
    get kind() {
        return 2 /* dynamic */;
    }
    appendTo(state) {
        state = state.append(/* segment */ this, /* value   */ "/");
        return state;
    }
    generate(params, consumed) {
        consumed[this.name] = true;
        return params[this.name];
    }
    equals(b) {
        return (
            b.kind === 2 /* dynamic */ &&
            b.optional === this.optional &&
            b.name === this.name
        );
    }
}
class StarSegment {
    constructor(name) {
        this.name = name;
    }
    get kind() {
        return 1 /* star */;
    }
    appendTo(state) {
        state = state.append(/* segment */ this, /* value   */ "");
        return state;
    }
    generate(params, consumed) {
        consumed[this.name] = true;
        return params[this.name];
    }
    equals(b) {
        return b.kind === 1 /* star */ && b.name === this.name;
    }
}
