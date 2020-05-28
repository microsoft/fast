import {
    ExecutionContext,
    Binding,
    setCurrentEvent,
    BindingObserver,
} from "../observation/observable";
import { Observable } from "../observation/observable";
import { DOM } from "../dom";
import { SyntheticView } from "../view";
import { Directive } from "./directive";
import { Behavior } from "./behavior";

function normalBind(
    this: BindingBehavior,
    source: unknown,
    context: ExecutionContext
): void {
    this.source = source;
    this.context = context;

    if (this.bindingObserver === null) {
        this.bindingObserver = Observable.binding(this.binding);
        this.bindingObserver.subscribe(this);
    }

    this.updateTarget(this.bindingObserver.observe(source, context));
}

function triggerBind(
    this: BindingBehavior,
    source: unknown,
    context: ExecutionContext
): void {
    this.source = source;
    this.context = context;
    this.target.addEventListener(this.targetName!, this, true);
}

function normalUnbind(this: BindingBehavior): void {
    this.bindingObserver!.disconnect();
    this.source = null;
    this.context = null;
}

type ComposableView = SyntheticView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
};

function contentUnbind(this: BindingBehavior): void {
    this.bindingObserver!.disconnect();
    this.source = null;
    this.context = null;

    const view = this.target.$fastView as ComposableView;

    if (view !== void 0 && view.isComposed) {
        view.unbind();
        view.needsBindOnly = true;
    }
}

function triggerUnbind(this: BindingBehavior): void {
    this.target.removeEventListener(this.targetName!, this, true);
    this.source = null;
    this.context = null;
}

function updateAttributeTarget(this: BindingBehavior, value: unknown): void {
    DOM.setAttribute(this.target, this.targetName!, value);
}

function updateBooleanAttributeTarget(this: BindingBehavior, value: unknown): void {
    DOM.setBooleanAttribute(this.target, this.targetName!, value as boolean);
}

function updateContentTarget(this: BindingBehavior, value: any): void {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }

    // If the value has a "create" method, then it's a template-like.
    if (value.create) {
        this.target.textContent = "";
        let view = this.target.$fastView as ComposableView;

        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            view = value.create() as SyntheticView;
        } else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (this.target.$fastTemplate !== value) {
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
            view.bind(this.source, this.context!);
            view.insertBefore(this.target);
            this.target.$fastView = view;
            this.target.$fastTemplate = value;
        } else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(this.source, this.context!);
        }
    } else {
        const view = this.target.$fastView as ComposableView;

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

        this.target.textContent = value;
    }
}

function updatePropertyTarget(this: BindingBehavior, value: unknown): void {
    this.target[this.targetName!] = value;
}

function updateClassTarget(this: BindingBehavior, value: string): void {
    const classVersions = this.classVersions || Object.create(null);
    const target = this.target;
    let version = this.version || 0;

    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);

        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];

            if (currentName === "") {
                continue;
            }

            classVersions[currentName] = version;
            target.classList.add(currentName);
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
            target.classList.remove(name);
        }
    }
}

/**
 * A directive that configures data binding to element content and attributes.
 */
export class BindingDirective extends Directive {
    private cleanedTargetName?: string;
    private originalTargetName?: string;

    public createPlaceholder: (index: number) => string =
        DOM.createInterpolationPlaceholder;
    private bind: typeof normalBind = normalBind;
    private unbind: typeof normalUnbind = normalUnbind;
    private updateTarget: typeof updateAttributeTarget = updateAttributeTarget;

    /**
     * Creates an instance of BindingDirective.
     * @param binding A binding that returns the data used to update the DOM.
     */
    constructor(public binding: Binding) {
        super();
    }

    /**
     * Gets the name of the attribute or property that this
     * binding is targeting.
     */
    public get targetName(): string | undefined {
        return this.originalTargetName;
    }

    /**
     * Sets the name of the attribute or property tha this
     * binding is targeting.
     */
    public set targetName(value: string | undefined) {
        this.originalTargetName = value;

        if (value === void 0) {
            return;
        }

        switch (value[0]) {
            case ":":
                this.cleanedTargetName = value.substr(1);
                this.updateTarget = updatePropertyTarget;
                if (this.cleanedTargetName === "innerHTML") {
                    const binding = this.binding;
                    /* eslint-disable-next-line */
                    this.binding = (s, c) => DOM.createHTML(binding(s, c));
                }
                break;
            case "?":
                this.cleanedTargetName = value.substr(1);
                this.updateTarget = updateBooleanAttributeTarget;
                break;
            case "@":
                this.cleanedTargetName = value.substr(1);
                this.bind = triggerBind;
                this.unbind = triggerUnbind;
                break;
            default:
                this.cleanedTargetName = value;

                if (value === "class") {
                    this.updateTarget = updateClassTarget;
                }

                break;
        }
    }

    /**
     * Makes this binding target the content of an element rather than
     * a particular attribute or property.
     */
    public targetAtContent(): void {
        this.updateTarget = updateContentTarget;
        this.unbind = contentUnbind;
    }

    /**
     * Creates the runtime BindingBehavior instance based on the configuration
     * information stored in the BindingDirective.
     * @param target The target node that the binding behavior should attach to.
     */
    createBehavior(target: any): BindingBehavior {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        return new BindingBehavior(
            target,
            this.binding,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}

/**
 * A behavior that updates content and attributes based on a configured
 * BindingDirective.
 */
export class BindingBehavior implements Behavior {
    public source: unknown = null;
    public context: ExecutionContext | null = null;
    public bindingObserver: BindingObserver | null = null;
    public classVersions: Record<string, number>;
    public version: number;

    /**
     *
     * @param target The target of the data updates.
     * @param binding The binding that returns the latest value for an update.
     * @param bind The operation to perform during binding.
     * @param unbind The operation to perform during unbinding.
     * @param updateTarget The operation to perform when updating.
     * @param targetName The name of the target attribute or property to update.
     */
    constructor(
        public target: any,
        public binding: Binding,
        public bind: typeof normalBind,
        public unbind: typeof normalUnbind,
        public updateTarget: typeof updatePropertyTarget,
        public targetName?: string
    ) {}

    /**
     * @internal
     */
    handleChange(): void {
        this.updateTarget(this.bindingObserver!.observe(this.source, this.context!));
    }

    /**
     * @internal
     */
    handleEvent(event: Event): void {
        setCurrentEvent(event);
        const result = this.binding(this.source, this.context!);
        setCurrentEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }
}
