import { DOM } from "../dom";
import type { Constructable, Mutable } from "../interfaces";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
    setCurrentEvent,
} from "../observation/observable";
import {
    InlinableHTMLDirective,
    ViewBehavior,
    ViewBehaviorTargets,
} from "./html-directive";
import type { CaptureType } from "./template";
import type { SyntheticView } from "./view";

export type BindingBehaviorFactory = {
    createBehavior(targets: ViewBehaviorTargets): ViewBehavior;
};

export type BindingType = (directive: HTMLBindingDirective) => BindingBehaviorFactory;

export interface BindingMode {
    attribute?: BindingType;
    booleanAttribute?: BindingType;
    property?: BindingType;
    content?: BindingType;
    tokenList?: BindingType;
    event?: BindingType;
}

export interface BindingConfig {
    mode: BindingMode;
    options: any;
}

interface UpdateTargetThis {
    directive: HTMLBindingDirective;
}

type UpdateTarget = (
    this: UpdateTargetThis,
    target,
    value,
    source: any,
    context: ExecutionContext
) => void;

class BindingBase {
    constructor(public readonly directive: HTMLBindingDirective) {}

    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {}

    createBehavior(): ViewBehavior {
        return this;
    }
}

class TargetUpdateBinding extends BindingBase {
    constructor(directive: HTMLBindingDirective, protected updateTarget: UpdateTarget) {
        super(directive);
    }

    static createType(updateTarget: UpdateTarget) {
        return directive => new this(directive, updateTarget);
    }
}

class OneTimeBinding extends TargetUpdateBinding {
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId];
        this.updateTarget(
            target,
            this.directive.binding(source, context),
            source,
            context
        );
    }
}

class OnChangeBinding extends TargetUpdateBinding {
    private isBindingVolatile: boolean;

    constructor(directive: HTMLBindingDirective, updateTarget: UpdateTarget) {
        super(directive, updateTarget);
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
}

function setPropertyTarget(this: UpdateTargetThis, target, value) {
    target[this.directive.aspect!] = value;
}

function setAttributeTarget(this: UpdateTargetThis, target, value) {
    DOM.setAttribute(target as HTMLElement, this.directive.aspect!, value);
}

function setBooleanAttributeTarget(this: UpdateTargetThis, target, value) {
    DOM.setBooleanAttribute(
        target as HTMLElement,
        this.directive.aspect!,
        value as boolean
    );
}

interface UpdateTokenListThis extends UpdateTargetThis {
    classVersions: any;
    version: number;
}

function updateTokenListTarget(
    this: UpdateTokenListThis,
    target: Element,
    value: any
): void {
    const classVersions = this.classVersions;
    const tokenList = target[this.directive.aspect!] as DOMTokenList;
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

function createTokenListBinding(BaseType: typeof TargetUpdateBinding) {
    return class TokenListBinding extends BaseType implements UpdateTokenListThis {
        classVersions = Object.create(null);
        version = 0;
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

function updateContentTarget(
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

function createContentBinding(BaseType: typeof TargetUpdateBinding) {
    return class extends BaseType {
        unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets) {
            super.unbind(source, context, targets);

            const target = targets[this.directive.targetId] as ContentTarget;
            const view = target.$fastView as ComposableView;

            if (view !== void 0 && view.isComposed) {
                view.unbind();
                view.needsBindOnly = true;
            }
        }
    };
}

type FASTEventSource = Node & {
    $fastSource: any;
    $fastContext: ExecutionContext | null;
};

class EventListener extends BindingBase {
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const target = targets[this.directive.targetId] as FASTEventSource;
        target.$fastSource = source;
        target.$fastContext = context;
        target.addEventListener(this.directive.aspect!, this, this.directive.options);
    }

    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        this.removeEventListener(targets[this.directive.targetId] as FASTEventSource);
    }

    protected removeEventListener(target: FASTEventSource) {
        target.$fastSource = null;
        target.$fastContext = null;
        target.removeEventListener(this.directive.aspect!, this, this.directive.options);
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

function createBindingConfig(
    BaseType: typeof TargetUpdateBinding,
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
        attribute: BaseType.createType(setAttributeTarget),
        booleanAttribute: BaseType.createType(setBooleanAttributeTarget),
        property: BaseType.createType(setPropertyTarget),
        content: createContentBinding(BaseType).createType(updateContentTarget),
        tokenList: createTokenListBinding(BaseType).createType(updateTokenListTarget),
        event: directive => new EventListener(directive),
    });

    return config;
}

export const onChange = createBindingConfig(OnChangeBinding, EventListener);
export const oneTime = createBindingConfig(OneTimeBinding, OneTimeEventListener);

export class HTMLBindingDirective extends InlinableHTMLDirective {
    private factory!: BindingBehaviorFactory;

    public readonly rawAspect?: string;
    public readonly aspect?: string;

    public constructor(
        public binding: Binding,
        public mode: BindingMode,
        public options: any
    ) {
        super();
    }

    public setAspect(value: string) {
        (this as Mutable<this>).rawAspect = value;

        if (!value) {
            return;
        }

        switch (value[0]) {
            case ":":
                (this as Mutable<this>).aspect = value.substr(1);
                switch (this.aspect) {
                    case "innerHTML":
                        const binding = this.binding;
                        /* eslint-disable-next-line */
                        this.binding = (s, c) => DOM.createHTML(binding(s, c));
                        this.factory = this.mode.property!(this);
                        break;
                    case "classList":
                        this.factory = this.mode.tokenList!(this);
                        break;
                    default:
                        this.factory = this.mode.property!(this);
                        break;
                }
                break;
            case "?":
                (this as Mutable<this>).aspect = value.substr(1);
                this.factory = this.mode.booleanAttribute!(this);
                break;
            case "@":
                (this as Mutable<this>).aspect = value.substr(1);
                this.factory = this.mode.event!(this);
                break;
            default:
                if (value === "class") {
                    (this as Mutable<this>).aspect = "className";
                    this.factory = this.mode.property!(this);
                } else {
                    (this as Mutable<this>).aspect = value;
                    this.factory = this.mode.attribute!(this);
                }
                break;
        }
    }

    createBehavior(targets: ViewBehaviorTargets): ViewBehavior {
        return (this.factory ?? this.mode.content!(this)).createBehavior(targets);
    }
}

export function bind<T = any>(
    binding: Binding,
    config: BindingConfig | DefaultBindingOptions = onChange
): CaptureType<T> {
    if (!("mode" in config)) {
        config = onChange(config);
    }

    return new HTMLBindingDirective(binding, config.mode, config.options);
}
