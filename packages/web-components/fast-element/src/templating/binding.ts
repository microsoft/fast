import { DOM } from "../dom";
import type { Constructable } from "../interfaces";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
    setCurrentEvent,
} from "../observation/observable";
import {
    TargetedHTMLDirective,
    ViewBehavior,
    ViewBehaviorTargets,
} from "./html-directive";
import type { CaptureType } from "./template";
import type { SyntheticView } from "./view";

export type BindingBehaviorFactory = {
    readonly directive: HTMLBindingDirective;
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior;
};

export type BindingFactory = new (
    directive: HTMLBindingDirective
) => BindingBehaviorFactory;

export interface BindingMode {
    attribute?: BindingFactory;
    booleanAttribute?: BindingFactory;
    property?: BindingFactory;
    content?: BindingFactory;
    tokenList?: BindingFactory;
    event?: BindingFactory;
}

export interface BindingConfig {
    mode: BindingMode;
    options: any;
}

interface ViewBinding extends BindingBehaviorFactory, ViewBehavior {
    updateTarget(target: Node, value: any, source: any, context: ExecutionContext): void;
}

abstract class ViewSetBinding implements ViewBinding {
    constructor(public readonly directive: HTMLBindingDirective) {}

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId];
        this.updateTarget(
            target,
            this.directive.binding(source, context),
            source,
            context
        );
    }

    unbind(): void {}

    createBehavior(): ViewBehavior {
        return this;
    }

    abstract updateTarget(
        target: Node,
        value: any,
        source: any,
        context: ExecutionContext
    ): void;
}

abstract class ViewUpdateBinding implements ViewBinding {
    private isBindingVolatile: boolean;

    constructor(public readonly directive: HTMLBindingDirective) {
        this.isBindingVolatile = Observable.isVolatileBinding(directive.binding);
    }

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId];
        const observer: BindingObserver =
            target[this.directive.targetId] ??
            (target[this.directive.targetId] = Observable.binding(
                this.directive.binding,
                this,
                this.isBindingVolatile
            ));

        (observer as any).target = target;
        (observer as any).source = source;
        (observer as any).context = context;

        this.updateTarget(target, observer.observe(source, context), source, context);
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId];
        const observer = target[this.directive.targetId];
        observer.disconnect();
        observer.target = null;
        observer.source = null;
        observer.context = null;
    }

    /** @internal */
    public handleChange(binding: Binding, observer: BindingObserver): void {
        const target = (observer as any).target;
        const source = (observer as any).source;
        const context = (observer as any).context;
        this.updateTarget(target, observer.observe(source, context!), source, context);
    }

    abstract updateTarget(
        target: Node,
        value: any,
        source: any,
        context: ExecutionContext
    ): void;

    createBehavior(): ViewBehavior {
        return this;
    }
}

function createPropertyBindingFactory<
    T extends Constructable<BindingFactory & ViewBinding>
>(BindingBase: T): BindingFactory {
    return class extends BindingBase {
        updateTarget(target: Node, value: any): void {
            target[this.directive.cleanedTargetName!] = value;
        }
    };
}

function createAttributeBindingFactory<
    T extends Constructable<BindingFactory & ViewBinding>
>(BindingBase: T): BindingFactory {
    return class extends BindingBase {
        updateTarget(target: Node, value: any): void {
            DOM.setAttribute(
                target as HTMLElement,
                this.directive.cleanedTargetName!,
                value
            );
        }
    };
}

function createBooleanAttributeBindingFactory<
    T extends Constructable<BindingFactory & ViewBinding>
>(BindingBase: T): BindingFactory {
    return class extends BindingBase {
        updateTarget(target: Node, value: any): void {
            DOM.setBooleanAttribute(
                target as HTMLElement,
                this.directive.cleanedTargetName!,
                value as boolean
            );
        }
    };
}

function createTokenListBindingFactory<T extends Constructable<ViewBinding>>(
    BindingBase: T
): BindingFactory {
    class TokenListBinding extends BindingBase {
        classVersions = Object.create(null);
        version = 0;

        updateTarget(target: Element, value: any): void {
            const classVersions = this.classVersions;
            const tokenList = target[this.directive.cleanedTargetName!] as DOMTokenList;
            let version = this.version;

            // Add the classes, tracking the version at which they were added.
            if (value !== null && value !== undefined && value.length) {
                const names = value.split(/\s+/);

                for (let i = 0, ii = names.length; i < ii; ++i) {
                    const currentName = names[i];

                    if (currentName === "") {
                        continue;
                    }

                    classVersions[currentName] = version;
                    tokenList.add(currentName);
                }
            }

            this.classVersions = classVersions;
            this.version = version + 1;

            // If this is the first call to add classes, there's no need to remove old ones.
            if (version === 0) {
                return;
            }

            // Remove classes from the previous version.
            version -= 1;

            for (const name in classVersions) {
                if (classVersions[name] === version) {
                    tokenList.remove(name);
                }
            }
        }
    }

    return class implements BindingBehaviorFactory {
        constructor(public directive: HTMLBindingDirective) {}
        createBehavior() {
            return new TokenListBinding(this.directive);
        }
    };
}

type ComposableView = SyntheticView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
};

type ContentTarget = Node & {
    $fastView?: ComposableView;
    $fastTemplate?: { create(): SyntheticView };
};

function createContentBindingFactory<
    T extends Constructable<BindingFactory & ViewBinding>
>(BindingBase: T): BindingFactory {
    return class extends BindingBase {
        unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets) {
            super.unbind(source, context, targets);

            const target = targets[this.directive.targetId] as ContentTarget;
            const view = target.$fastView as ComposableView;

            if (view !== void 0 && view.isComposed) {
                view.unbind();
                view.needsBindOnly = true;
            }
        }

        updateTarget(
            target: ContentTarget,
            value: any,
            source: any,
            context: ExecutionContext
        ): void {
            // If there's no actual value, then this equates to the
            // empty string for the purposes of content bindings.
            if (value === null || value === undefined) {
                value = "";
            }

            // If the value has a "create" method, then it's a template-like.
            if (value.create) {
                target.textContent = "";
                let view = target.$fastView as ComposableView;

                // If there's no previous view that we might be able to
                // reuse then create a new view from the template.
                if (view === void 0) {
                    view = value.create() as SyntheticView;
                } else {
                    // If there is a previous view, but it wasn't created
                    // from the same template as the new value, then we
                    // need to remove the old view if it's still in the DOM
                    // and create a new view from the template.
                    if (target.$fastTemplate !== value) {
                        if (view.isComposed) {
                            view.remove();
                            view.unbind();
                        }

                        view = value.create() as SyntheticView;
                    }
                }

                // It's possible that the value is the same as the previous template
                // and that there's actually no need to compose it.
                if (!view.isComposed) {
                    view.isComposed = true;
                    view.bind(source, context!);
                    view.insertBefore(target);
                    target.$fastView = view;
                    target.$fastTemplate = value;
                } else if (view.needsBindOnly) {
                    view.needsBindOnly = false;
                    view.bind(source, context!);
                }
            } else {
                const view = target.$fastView as ComposableView;

                // If there is a view and it's currently composed into
                // the DOM, then we need to remove it.
                if (view !== void 0 && view.isComposed) {
                    view.isComposed = false;
                    view.remove();

                    if (view.needsBindOnly) {
                        view.needsBindOnly = false;
                    } else {
                        view.unbind();
                    }
                }

                target.textContent = value;
            }
        }
    };
}

type FASTEventSource = Node & {
    $fastSource: any;
    $fastContext: ExecutionContext | null;
};

class EventListener implements BindingBehaviorFactory {
    constructor(public directive: HTMLBindingDirective) {}

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId] as FASTEventSource;
        target.$fastSource = source;
        target.$fastContext = context;
        target.addEventListener(
            this.directive.cleanedTargetName!,
            this,
            this.directive.options
        );
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        this.removeEventListener(targets[this.directive.targetId] as FASTEventSource);
    }

    protected removeEventListener(target: FASTEventSource) {
        target.$fastSource = null;
        target.$fastContext = null;
        target.removeEventListener(
            this.directive.cleanedTargetName!,
            this,
            this.directive.options
        );
    }

    handleEvent(event: Event): void {
        const target = event.currentTarget as any;
        const source = target.$fastSource;
        const context = target.$fastContext;

        setCurrentEvent(event);
        const result = this.directive.binding(source, context);
        setCurrentEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }

    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return this;
    }
}

class OneTimeEventListener extends EventListener {
    handleEvent(event: Event) {
        super.handleEvent(event);
        this.removeEventListener(event.currentTarget as FASTEventSource);
    }
}

export type DefaultBindingOptions = {
    capture?: boolean;
};

const defaultBindingOptions: DefaultBindingOptions = {
    capture: false,
};

function createBindingConfig<T extends Constructable<BindingFactory & ViewBinding>>(
    BindingBase: T,
    EventListener: Constructable<EventListener>
) {
    const config: BindingConfig & ((options?: DefaultBindingOptions) => BindingConfig) = (
        options: DefaultBindingOptions
    ): BindingConfig => {
        return {
            mode: config.mode,
            options: Object.assign({}, defaultBindingOptions, options),
        };
    };

    config.options = defaultBindingOptions;
    config.mode = Object.freeze({
        attribute: createAttributeBindingFactory(BindingBase),
        booleanAttribute: createBooleanAttributeBindingFactory(BindingBase),
        property: createPropertyBindingFactory(BindingBase),
        content: createContentBindingFactory(BindingBase),
        tokenList: createTokenListBindingFactory(BindingBase),
        event: EventListener,
    });

    return config;
}

export const updateView = createBindingConfig(ViewUpdateBinding as any, EventListener);
export const oneTime = createBindingConfig(ViewSetBinding as any, OneTimeEventListener);

export class HTMLBindingDirective extends TargetedHTMLDirective {
    private originalTargetName?: string;
    private factory!: BindingBehaviorFactory;

    public cleanedTargetName?: string;

    public constructor(
        public binding: Binding,
        public mode: BindingMode,
        public options: any
    ) {
        super();
    }

    /**
     * Gets/sets the name of the attribute or property that this
     * binding is targeting.
     */
    public get targetName(): string | undefined {
        return this.originalTargetName;
    }

    public set targetName(value: string | undefined) {
        this.originalTargetName = value;

        if (value === void 0) {
            return;
        }

        switch (value[0]) {
            case ":":
                this.cleanedTargetName = value.substr(1);
                switch (this.cleanedTargetName) {
                    case "innerHTML":
                        const binding = this.binding;
                        /* eslint-disable-next-line */
                        this.binding = (s, c) => DOM.createHTML(binding(s, c));
                        this.factory = new this.mode.property!(this);
                        break;
                    case "classList":
                        this.factory = new this.mode.tokenList!(this);
                        break;
                    default:
                        this.factory = new this.mode.property!(this);
                        break;
                }
                break;
            case "?":
                this.cleanedTargetName = value.substr(1);
                this.factory = new this.mode.booleanAttribute!(this);
                break;
            case "@":
                this.cleanedTargetName = value.substr(1);
                this.factory = new this.mode.event!(this);
                break;
            default:
                this.cleanedTargetName = value;

                if (value === "class") {
                    this.cleanedTargetName = "className";
                    this.factory = new this.mode.property!(this);
                } else {
                    this.factory = new this.mode.attribute!(this);
                }

                break;
        }
    }

    public targetAtContent(): void {
        this.factory = new this.mode.content!(this);
    }

    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return this.factory.createBehavior(targets);
    }
}

export function bind<T = any>(
    binding: Binding,
    config: BindingConfig | DefaultBindingOptions = updateView
): CaptureType<T> {
    if (!("mode" in config)) {
        config = updateView(config);
    }

    return new HTMLBindingDirective(binding, config.mode, config.options);
}
