export type Path = {
    value: string;
    caseSensitive?: boolean;
};

export class Endpoint<TSettings = any> {
    public constructor(
        public readonly collectsResidue: boolean,
        public readonly path: Path,
        public readonly paramNames: readonly string[],
        public readonly settings: TSettings | null
    ) {}
}

export class RecognizedRoute<TSettings = any> {
    public constructor(
        public readonly endpoint: Endpoint<TSettings>,
        public readonly params: { [key: string]: unknown },
        public readonly residue: string | null
    ) {}

    get settings(): TSettings | null {
        return this.endpoint.settings;
    }
}

const RESIDUE = "fast$residue" as const;

class Candidate {
    public head: AnyState;
    public endpoint: Endpoint;

    public constructor(
        private readonly chars: string[],
        private readonly states: AnyState[],
        private readonly skippedStates: DynamicState[],
        private readonly result: RecognizeResult
    ) {
        this.head = states[states.length - 1];
        this.endpoint = this.head?.endpoint!;
    }

    public advance(ch: string): void {
        const { chars, states, skippedStates, result } = this;
        let stateToAdd: AnyState | null = null;

        let matchCount = 0;
        const state = states[states.length - 1];

        function $process(nextState: AnyState, skippedState: DynamicState | null): void {
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
            if ((stateToAdd as AnyState).endpoint !== null) {
                this.endpoint = (stateToAdd as AnyState).endpoint!;
            }
        }

        if (matchCount === 0) {
            result.remove(this);
        }
    }

    public finalize(): void {
        function collectSkippedStates(
            skippedStates: DynamicState[],
            state: AnyState
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
    public compareTo(b: Candidate): -1 | 1 | 0 {
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
        // TODO: probably want to warn or even throw here, but unload it be for now.
        return 0;
    }
}

class RecognizeResult {
    private readonly candidates: Candidate[] = [];

    public get isEmpty(): boolean {
        return this.candidates.length === 0;
    }

    public constructor(rootState: SeparatorState) {
        this.candidates = [new Candidate([""], [rootState], [], this)];
    }

    public getSolution(): Candidate | null {
        const candidates = this.candidates.filter(function (candidate) {
            return candidate.head.endpoint !== null;
        });
        if (candidates.length === 0) {
            return null;
        }

        for (const candidate of candidates) {
            candidate.finalize();
        }

        candidates.sort(function (a, b) {
            return a.compareTo(b);
        });

        return candidates[0];
    }

    public add(candidate: Candidate): void {
        this.candidates.push(candidate);
    }

    public remove(candidate: Candidate): void {
        this.candidates.splice(this.candidates.indexOf(candidate), 1);
    }

    public advance(ch: string): void {
        const candidates = this.candidates.slice();

        for (const candidate of candidates) {
            candidate.advance(ch);
        }
    }
}

export class RouteRecognizer<TSettings> {
    private readonly rootState: SeparatorState = new State(
        null,
        null,
        ""
    ) as SeparatorState;
    private readonly cache: Map<string, RecognizedRoute<TSettings> | null> = new Map();

    public add(path: Path, collectResidue: boolean, settings?: TSettings): void {
        this.$add(path, false, settings);
        if (collectResidue) {
            this.$add(path, true, settings);
        }

        // Clear the cache whenever there are state changes, because the recognizeResults could be arbitrarily different as a result
        this.cache.clear();
    }

    private $add(path: Path, collectResidue: boolean, settings?: TSettings): void {
        const analyzablePath = collectResidue ? `${path.value}/*${RESIDUE}` : path.value;

        // Normalize leading, trailing and double slashes by ignoring empty segments
        const parts =
            analyzablePath === ""
                ? [""]
                : analyzablePath.split("/").filter(function (part) {
                      return part.length > 0;
                  });
        const paramNames: string[] = [];

        let state = this.rootState as AnyState;

        for (const part of parts) {
            // Each segment always begins with a slash, so we represent this with a non-segment state
            state = state.append(null, "/");

            switch (part.charAt(0)) {
                case ":": {
                    // route parameter
                    const isOptional = part.endsWith("?");
                    const name = isOptional ? part.slice(1, -1) : part.slice(1);
                    paramNames.push(name);
                    state = new DynamicSegment(name, isOptional).appendTo(state);
                    break;
                }
                case "*": {
                    // dynamic route
                    const name = part.slice(1);
                    paramNames.push(name);
                    state = new StarSegment(name).appendTo(state);
                    break;
                }
                default: {
                    // standard path route
                    state = new StaticSegment(part, path.caseSensitive === true).appendTo(
                        state
                    );
                    break;
                }
            }
        }

        const endpoint = new Endpoint(collectResidue, path, paramNames, settings || null);

        state.setEndpoint(endpoint);
    }

    public recognize(path: string): RecognizedRoute<TSettings> | null {
        let result = this.cache.get(path);
        if (result === void 0) {
            this.cache.set(path, (result = this.$recognize(path)));
        }
        return result;
    }

    private $recognize(path: string): RecognizedRoute<TSettings> | null {
        path = decodeURI(path);

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
        const params = candidate.getParams();
        let residue: string | null;
        if (Reflect.has(params, RESIDUE)) {
            residue = params[RESIDUE] ?? null;
            Reflect.deleteProperty(params, RESIDUE);
        } else {
            residue = null;
        }

        return new RecognizedRoute(endpoint, params, residue);
    }
}

type StaticState = State & {
    readonly isSeparator: false;
    readonly isDynamic: false;
    readonly isOptional: false;

    readonly prevState: StaticState | SeparatorState;
    readonly segment: StaticSegment;
};

type DynamicState = State & {
    readonly isSeparator: false;
    readonly isDynamic: true;
    readonly isOptional: true | false;

    readonly prevState: SeparatorState;
    readonly segment: DynamicSegment;
};

type StarState = State & {
    readonly isSeparator: false;
    readonly isDynamic: true;
    readonly isOptional: false;

    readonly prevState: SeparatorState;
    readonly segment: StarSegment;
};

type SeparatorState = State & {
    readonly isSeparator: true;
    readonly isDynamic: false;
    readonly isOptional: false;

    readonly path: null;
    readonly segment: null;
};

type AnyState = StaticState | DynamicState | StarState | SeparatorState;

type SegmentToState<S> = S extends StaticSegment
    ? StaticState
    : S extends DynamicSegment
    ? DynamicState
    : S extends StarSegment
    ? StarState
    : S extends null
    ? SeparatorState
    : never;

class State {
    public nextStates: AnyState[] | null = null;
    public readonly isSeparator: boolean;
    public readonly isDynamic: boolean;
    public readonly isOptional: boolean;

    public endpoint: Endpoint | null = null;
    public readonly length: number;

    public constructor(
        public readonly prevState: AnyState | null,
        public readonly segment: AnySegment | null,
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

    public append<S extends AnySegment | null>(
        segment: S,
        value: string
    ): SegmentToState<S> {
        let state: AnyState | undefined;
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
                (state = new State(this as AnyState, segment, value) as AnyState)
            );
        }

        return state as SegmentToState<S>;
    }

    public setEndpoint(this: AnyState, endpoint: Endpoint): void {
        if (this.endpoint !== null) {
            throw new Error(
                `Cannot add ambiguous route. The pattern ${endpoint.path.value} clashes with ${this.endpoint.path.value}`
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

type AnySegment = StaticSegment | DynamicSegment | StarSegment;

const enum SegmentKind {
    star = 1,
    dynamic = 2,
    static = 3,
}

class StaticSegment {
    public get kind(): SegmentKind.static {
        return SegmentKind.static;
    }

    public constructor(
        public readonly value: string,
        public readonly caseSensitive: boolean
    ) {}

    public appendTo(state: AnyState): StaticState {
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

        return state as StaticState;
    }

    public equals(b: AnySegment): boolean {
        return (
            b.kind === SegmentKind.static &&
            b.caseSensitive === this.caseSensitive &&
            b.value === this.value
        );
    }
}

class DynamicSegment {
    public get kind(): SegmentKind.dynamic {
        return SegmentKind.dynamic;
    }

    public constructor(public readonly name: string, public readonly optional: boolean) {}

    public appendTo(state: AnyState): DynamicState {
        state = state.append(/* segment */ this, /* value   */ "/");

        return state;
    }

    public equals(b: AnySegment): boolean {
        return (
            b.kind === SegmentKind.dynamic &&
            b.optional === this.optional &&
            b.name === this.name
        );
    }
}

class StarSegment {
    public get kind(): SegmentKind.star {
        return SegmentKind.star;
    }

    public constructor(public readonly name: string) {}

    public appendTo(state: AnyState): StarState {
        state = state.append(/* segment */ this, /* value   */ "");

        return state;
    }

    public equals(b: AnySegment): boolean {
        return b.kind === SegmentKind.star && b.name === this.name;
    }
}
