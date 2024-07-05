import { ViewTemplate } from "@microsoft/fast-element";

export interface TemplateCacheController {
    /**
     * True when fast-ssr is not caching template results,
     * false when it is leveraging the cache.
     *
     * @default true;
     */
    readonly disabled: boolean;

    /**
     * Disables template caching and retrieval of template cache results from the cache.
     */
    disable(): void;

    /**
     * Enables template caching.
     */
    enable(): void;

    /**
     * Returns true when a provided template has been cached, otherwise false
     */
    has(template: ViewTemplate): boolean;
}

export class TemplateCacheControllerImpl implements TemplateCacheController {
    constructor(private cache: Pick<WeakMap<ViewTemplate, any>, "get" | "has" | "set">) {}
    #disabled = false;

    public get disabled() {
        return this.#disabled;
    }

    public disable(): void {
        this.#disabled = true;
    }

    public enable(): void {
        this.#disabled = false;
    }

    public has(template: ViewTemplate): boolean {
        return this.cache.has(template);
    }

    public static create(
        ...cache: ConstructorParameters<typeof TemplateCacheControllerImpl>
    ): TemplateCacheController {
        return new TemplateCacheControllerImpl(...cache);
    }
}
