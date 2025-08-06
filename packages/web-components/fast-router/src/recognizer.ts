import { Route } from "./navigation.js";
import { QueryString } from "./query-string.js";

/**
 * @beta
 */
export interface RouteParameterConverterContext<TSettings = any> {
    readonly endpoint: Endpoint<TSettings>;
    readonly params: Readonly<Record<string, string | undefined>>;
    readonly typedParams: Record<string, any>;
    readonly queryParams: Record<string, string>;
}

/**
 * @beta
 */
export type RouteParameterConverter = (
    name: string,
    value: string | undefined,
    context: RouteParameterConverterContext
) => any | Promise<any>;
const defaultParameterConverter: RouteParameterConverter = (
    name: string,
    value: string | undefined,
    context: RouteParameterConverterContext
) => {
    return value;
};

/**
 * @beta
 */
export class ConfigurableRoute implements Route {
    public constructor(
        public readonly path: string,
        public readonly name: string,
        public readonly caseSensitive: boolean
    ) {}
}

/**
 * @beta
 */
export class Endpoint<TSettings = any> {
    public constructor(
        public readonly route: ConfigurableRoute,
        public readonly paramNames: readonly string[],
        public readonly paramTypes: readonly string[],
        public readonly settings: TSettings | null
    ) {}

    public get path() {
        return this.route.path;
    }
}

/**
 * @beta
 */
export class RecognizedRoute<TSettings = any> {
    public readonly allParams: Readonly<Record<string, string | undefined>>;
    public readonly allTypedParams: Readonly<Record<string, any>>;

    public constructor(
        public readonly endpoint: Endpoint<TSettings>,
        public readonly params: Readonly<Record<string, string | undefined>>,
        public readonly typedParams: Readonly<Record<string, any>>,
        public readonly queryParams: Readonly<Record<string, string>>
    ) {
        this.allParams = {
            ...params,
            ...queryParams,
        };

        this.allTypedParams = {
            ...queryParams,
            ...typedParams,
        };
    }

    public get settings() {
        return this.endpoint.settings;
    }
}

class Candidate<T> {
    public head: AnyState<T>;
    public endpoint: Endpoint<T>;

    public constructor(
        private readonly chars: string[],
        private readonly states: AnyState<T>[],
        private readonly skippedStates: DynamicState<T>[],
        private readonly result: RecognizeResult<T>
    ) {
        this.head = states[states.length - 1];
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        this.endpoint = this.head?.endpoint!;
    }

    public advance(ch: string): void {
        const { chars, states, skippedStates, result } = this;
        let stateToAdd: AnyState<T> | null = null;

        let matchCount = 0;
        const state = states[states.length - 1];

        function $process(
            nextState: AnyState<T>,
            skippedState: DynamicState<T> | null
        ): void {
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
            if ((stateToAdd as AnyState<T>).endpoint !== null) {
                this.endpoint = (stateToAdd as AnyState<T>).endpoint!;
            }
        }

        if (matchCount === 0) {
            result.remove(this);
        }
    }

    public finalize(): void {
        function collectSkippedStates(
            skippedStates: DynamicState<T>[],
            state: AnyState<T>
        ): void {
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

    public getParams(): Record<string, string | undefined> {
        const { states, chars, endpoint } = this;

        const params: Record<string, string | undefined> = {};
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
    public compareTo(b: Candidate<T>): -1 | 1 | 0 {
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

                segmentA = stateA.segment!;
            } else if (segmentB === null) {
                if ((stateB = statesB[++iB]) === void 0) {
                    return -1;
                }

                segmentB = stateB.segment!;
            }

            if (segmentA!.kind < segmentB!.kind) {
                return 1;
            }

            if (segmentA!.kind > segmentB!.kind) {
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

function hasEndpoint<T>(candidate: Candidate<T>): boolean {
    return candidate.head.endpoint !== null;
}

function compareChains<T>(a: Candidate<T>, b: Candidate<T>): -1 | 1 | 0 {
    return a.compareTo(b);
}

class RecognizeResult<T> {
    private readonly candidates: Candidate<T>[] = [];

    public get isEmpty(): boolean {
        return this.candidates.length === 0;
    }

    public constructor(rootState: SeparatorState<T>) {
        this.candidates = [new Candidate([""], [rootState], [], this)];
    }

    public getSolution(): Candidate<T> | null {
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

    public add(candidate: Candidate<T>): void {
        this.candidates.push(candidate);
    }

    public remove(candidate: Candidate<T>): void {
        this.candidates.splice(this.candidates.indexOf(candidate), 1);
    }

    public advance(ch: string): void {
        const candidates = this.candidates.slice();

        for (const candidate of candidates) {
            candidate.advance(ch);
        }
    }
}

/**
 * @beta
 */
export interface RouteRecognizer<TSettings> {
    add(routeOrRoutes: Route | readonly Route[], settings?: TSettings): void;
    recognize(
        path: string,
        converters?: Readonly<Record<string, RouteParameterConverter>>
    ): Promise<RecognizedRoute<TSettings> | null>;
    generateFromName(name: string, params: object): string | null;
    generateFromPath(path: string, params: object): string | null;
}

/**
 * @beta
 */
export class DefaultRouteRecognizer<TSettings> implements RouteRecognizer<TSettings> {
    private names = new Map<string, AnySegment<any>[]>();
    private paths = new Map<string, AnySegment<any>[]>();
    private readonly rootState: SeparatorState<TSettings> = new State(
        null,
        null,
        ""
    ) as SeparatorState<TSettings>;

    public add(routeOrRoutes: Route | readonly Route[], settings?: TSettings): void {
        if (routeOrRoutes instanceof Array) {
            for (const route of routeOrRoutes) {
                this.$add(route, settings);
            }
        } else {
            this.$add(routeOrRoutes as Route, settings);
        }
    }

    private $add(route: Route, settings?: TSettings): void {
        const path = route.path;
        const $route = new ConfigurableRoute(
            route.path,
            route.name || "",
            route.caseSensitive === true
        );

        // Normalize leading, trailing and double slashes by ignoring empty segments
        const parts = path === "" ? [""] : path.split("/").filter(isNotEmpty);
        const paramNames: string[] = [];
        const paramTypes: string[] = [];

        let state = this.rootState as AnyState<TSettings>;
        const segments: AnySegment<any>[] = [];

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
                    const segment = new DynamicSegment<TSettings>(name, isOptional);
                    segments.push(segment);
                    state = segment.appendTo(state);
                    break;
                }

                case "*": {
                    // dynamic route
                    const name = part.slice(1);
                    paramNames.push(name);
                    paramTypes.push("string");
                    const segment = new StarSegment<TSettings>(name);
                    segments.push(segment);
                    state = segment.appendTo(state);
                    break;
                }

                default: {
                    // standard path route
                    const segment = new StaticSegment<TSettings>(
                        part,
                        $route.caseSensitive
                    );
                    segments.push(segment);
                    state = segment.appendTo(state);
                    break;
                }
            }
        }

        const endpoint = new Endpoint<TSettings>(
            $route,
            paramNames,
            paramTypes,
            settings || null
        );

        state.setEndpoint(endpoint);
        this.paths.set(path, segments);

        if (route.name) {
            this.names.set(route.name, segments);
        }
    }

    public async recognize(
        path: string,
        converters: Readonly<Record<string, RouteParameterConverter>> = {}
    ): Promise<RecognizedRoute<TSettings> | null> {
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
        const typedParams = {} as Record<string, any>;
        const converterContext: RouteParameterConverterContext = {
            endpoint,
            params,
            typedParams,
            queryParams,
        };

        for (let i = 0, ii = paramNames.length; i < ii; ++i) {
            const paramName = paramNames[i];
            const paramValue = params[paramName];
            const convert = converters[paramTypes[i]] || defaultParameterConverter;
            typedParams[paramName] = await convert(
                paramName,
                paramValue,
                converterContext
            );
        }

        return new RecognizedRoute<TSettings>(endpoint, params, typedParams, queryParams);
    }

    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name - The name of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    public generateFromName(name: string, params: object): string | null {
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
    public generateFromPath(path: string, params: object): string | null {
        return this.generate(this.paths.get(path), params);
    }

    private generate(
        segments: AnySegment<any>[] | undefined,
        params: object
    ): string | null {
        if (!segments) {
            return null;
        }

        const routeParams = Object.assign({}, params) as Record<string, string>;
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
        for (const param in consumed) {
            delete routeParams[param];
        }

        const queryString = QueryString.build(routeParams);
        output += queryString ? `?${queryString}` : "";

        return output;
    }
}

type StaticState<T> = State<T> & {
    readonly isSeparator: false;
    readonly isDynamic: false;
    readonly isOptional: false;

    readonly prevState: StaticState<T> | SeparatorState<T>;
    readonly segment: StaticSegment<T>;
};

type DynamicState<T> = State<T> & {
    readonly isSeparator: false;
    readonly isDynamic: true;
    readonly isOptional: true | false;

    readonly prevState: SeparatorState<T>;
    readonly segment: DynamicSegment<T>;
};

type StarState<T> = State<T> & {
    readonly isSeparator: false;
    readonly isDynamic: true;
    readonly isOptional: false;

    readonly prevState: SeparatorState<T>;
    readonly segment: StarSegment<T>;
};

type SeparatorState<T> = State<T> & {
    readonly isSeparator: true;
    readonly isDynamic: false;
    readonly isOptional: false;

    readonly path: null;
    readonly segment: null;
};

type AnyState<T> = StaticState<T> | DynamicState<T> | StarState<T> | SeparatorState<T>;

type SegmentToState<S, T> = S extends StaticSegment<T>
    ? StaticState<T>
    : S extends DynamicSegment<T>
    ? DynamicState<T>
    : S extends StarSegment<T>
    ? StarState<T>
    : S extends null
    ? SeparatorState<T>
    : never;

class State<T> {
    public nextStates: AnyState<T>[] | null = null;
    public readonly isSeparator: boolean;
    public readonly isDynamic: boolean;
    public readonly isOptional: boolean;

    public endpoint: Endpoint<T> | null = null;
    public readonly length: number;

    public constructor(
        public readonly prevState: AnyState<T> | null,
        public readonly segment: AnySegment<T> | null,
        public readonly value: string
    ) {
        switch (segment?.kind) {
            case SegmentKind.dynamic:
                this.length = prevState!.length + 1;
                this.isSeparator = false;
                this.isDynamic = true;
                this.isOptional = segment.optional;
                break;
            case SegmentKind.star:
                this.length = prevState!.length + 1;
                this.isSeparator = false;
                this.isDynamic = true;
                this.isOptional = false;
                break;
            case SegmentKind.static:
                this.length = prevState!.length + 1;
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

    public append<S extends AnySegment<T> | null>(
        segment: S,
        value: string
    ): SegmentToState<S, T> {
        let state: AnyState<T> | undefined;
        let nextStates = this.nextStates;
        if (nextStates === null) {
            state = void 0;
            nextStates = this.nextStates = [];
        } else if (segment === null) {
            state = nextStates.find(s => s.value === value);
        } else {
            state = nextStates.find(s => s.segment?.equals(segment!));
        }

        if (state === void 0) {
            nextStates.push(
                (state = new State(this as AnyState<T>, segment, value) as AnyState<T>)
            );
        }

        return state as SegmentToState<S, T>;
    }

    public setEndpoint(this: AnyState<T>, endpoint: Endpoint<T>): void {
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

    public isMatch(ch: string): boolean {
        const segment = this.segment;
        switch (segment?.kind) {
            case SegmentKind.dynamic:
                return !this.value.includes(ch);
            case SegmentKind.star:
                return true;
            case SegmentKind.static:
            case undefined:
                // segment separators (slashes) are non-segments. We could say return ch === '/' as well, technically.
                return this.value.includes(ch);
        }
    }
}

function isNotEmpty(segment: string): boolean {
    return segment.length > 0;
}

type AnySegment<T> = StaticSegment<T> | DynamicSegment<T> | StarSegment<T>;

const enum SegmentKind {
    star = 1,
    dynamic = 2,
    static = 3,
}

class StaticSegment<T> {
    public get kind(): SegmentKind.static {
        return SegmentKind.static;
    }

    public constructor(
        public readonly value: string,
        public readonly caseSensitive: boolean
    ) {}

    public appendTo(state: AnyState<T>): StaticState<T> {
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

        return state as StaticState<T>;
    }

    public generate(): string {
        return this.value;
    }

    public equals(b: AnySegment<T>): boolean {
        return (
            b.kind === SegmentKind.static &&
            b.caseSensitive === this.caseSensitive &&
            b.value === this.value
        );
    }
}

class DynamicSegment<T> {
    public get kind(): SegmentKind.dynamic {
        return SegmentKind.dynamic;
    }

    public constructor(public readonly name: string, public readonly optional: boolean) {}

    public appendTo(state: AnyState<T>): DynamicState<T> {
        state = state.append(/* segment */ this, /* value   */ "/");

        return state;
    }

    public generate(
        params: Record<string, string>,
        consumed: Record<string, boolean>
    ): string {
        consumed[this.name] = true;
        return params[this.name];
    }

    public equals(b: AnySegment<T>): boolean {
        return (
            b.kind === SegmentKind.dynamic &&
            b.optional === this.optional &&
            b.name === this.name
        );
    }
}

class StarSegment<T> {
    public get kind(): SegmentKind.star {
        return SegmentKind.star;
    }

    public constructor(public readonly name: string) {}

    public appendTo(state: AnyState<T>): StarState<T> {
        state = state.append(/* segment */ this, /* value   */ "");
        return state;
    }

    public generate(
        params: Record<string, string>,
        consumed: Record<string, boolean>
    ): string {
        consumed[this.name] = true;
        return params[this.name];
    }

    public equals(b: AnySegment<T>): boolean {
        return b.kind === SegmentKind.star && b.name === this.name;
    }
}
