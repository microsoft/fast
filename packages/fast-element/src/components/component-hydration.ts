type TypeHydrationState = {
    promise: Promise<void>;
    pendingCount: number;
    resolve(): void;
    resolveTimer: ReturnType<typeof setTimeout> | null;
    resolved: boolean;
};

const typeHydrationStates = new WeakMap<Function, TypeHydrationState>();
const observedHydrationTypes = new Set<Function>();

function createTypeHydrationState(type: Function): TypeHydrationState {
    let resolve!: () => void;
    const promise = new Promise<void>(settle => {
        resolve = settle;
    });
    const state = {
        promise,
        pendingCount: 0,
        resolve,
        resolveTimer: null,
        resolved: false,
    };

    typeHydrationStates.set(type, state);
    observedHydrationTypes.add(type);

    return state;
}

function getTypeHydrationState(type: Function): TypeHydrationState {
    return typeHydrationStates.get(type) ?? createTypeHydrationState(type);
}

function prepareTypeHydrationState(state: TypeHydrationState): void {
    let resolve!: () => void;
    state.promise = new Promise<void>(settle => {
        resolve = settle;
    });
    state.resolve = resolve;
    state.resolved = false;
}

function resolveTypeHydrationState(state: TypeHydrationState): void {
    if (state.resolved) {
        return;
    }

    if (state.resolveTimer !== null) {
        clearTimeout(state.resolveTimer);
        state.resolveTimer = null;
    }

    state.resolved = true;
    state.resolve();
}

function scheduleTypeHydrationResolution(state: TypeHydrationState): void {
    if (state.resolveTimer !== null) {
        clearTimeout(state.resolveTimer);
    }

    state.resolveTimer = setTimeout(() => {
        state.resolveTimer = null;

        if (state.pendingCount === 0) {
            resolveTypeHydrationState(state);
        }
    }, 0);
}

/**
 * Gets the promise used by FASTElement static `whenHydrated`.
 * @internal
 */
export function getFASTElementTypeHydration(type: Function): Promise<void> {
    return getTypeHydrationState(type).promise;
}

/**
 * Marks a FAST element type as pending hydration.
 * @internal
 */
export function addFASTElementTypeHydration(type: Function): void {
    const state = getTypeHydrationState(type);

    if (state.resolveTimer !== null) {
        clearTimeout(state.resolveTimer);
        state.resolveTimer = null;
    }

    if (state.resolved) {
        prepareTypeHydrationState(state);
    }

    state.pendingCount++;
}

/**
 * Marks a FAST element type as no longer pending hydration.
 * @internal
 */
export function removeFASTElementTypeHydration(type: Function): void {
    const state = getTypeHydrationState(type);

    if (state.pendingCount > 0) {
        state.pendingCount--;
    }

    if (state.pendingCount === 0) {
        scheduleTypeHydrationResolution(state);
    }
}

/**
 * Resolves all component-specific hydration promises that have no active work.
 * @internal
 */
export function resolveFASTElementHydrationBatch(): void {
    for (const type of observedHydrationTypes) {
        const state = typeHydrationStates.get(type);

        if (state !== void 0 && state.pendingCount === 0) {
            resolveTypeHydrationState(state);
        }
    }
}
