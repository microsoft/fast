import {
    ExecutionContext,
    Expression,
    setCurrentEvent,
} from "../observation/observable.js";
import { ObservableExpression } from "../observation/observable.js";
import { DOM } from "../dom.js";
import { Directive } from "./directive.js";
import { Behavior } from "./behavior.js";

function normalBind(
    this: BindingBehavior,
    source: unknown,
    context: ExecutionContext
): void {
    this.source = source;
    this.context = context;

    if (this.observableExpression === null) {
        this.observableExpression = new ObservableExpression(this.expression, this);
    }

    this.updateTarget(this.observableExpression.evaluate(source, context));
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
    this.observableExpression!.dispose();
    this.source = null;
    this.context = null;
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

function updateTextTarget(this: BindingBehavior, value: unknown): void {
    this.target.textContent = value as string;
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

export class BindingDirective extends Directive {
    private cleanedTargetName?: string;
    private originalTargetName?: string;

    public createPlaceholder: (index: number) => string =
        DOM.createInterpolationPlaceholder;
    private bind: typeof normalBind = normalBind;
    private unbind: typeof normalUnbind = normalUnbind;
    private updateTarget: typeof updateAttributeTarget = updateAttributeTarget;

    constructor(public expression: Expression) {
        super();
    }

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
                this.updateTarget = updatePropertyTarget;
                if (this.cleanedTargetName === "innerHTML") {
                    const expression = this.expression;
                    /* eslint-disable-next-line */
                    this.expression = (s, c) => DOM.createHTML(expression(s, c));
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

    public makeIntoTextBinding(): void {
        this.updateTarget = updateTextTarget;
    }

    createBehavior(target: any): BindingBehavior {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        return new BindingBehavior(
            target,
            this.expression,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}

export class BindingBehavior implements Behavior {
    public source: unknown = null;
    public context: ExecutionContext | null = null;
    public observableExpression: ObservableExpression | null = null;
    public classVersions: Record<string, number>;
    public version: number;

    constructor(
        public target: any,
        public expression: Expression,
        public bind: typeof normalBind,
        public unbind: typeof normalUnbind,
        public updateTarget: typeof updatePropertyTarget,
        public targetName?: string
    ) {}

    handleExpressionChange(): void {
        this.updateTarget(
            this.observableExpression!.evaluate(this.source, this.context!)
        );
    }

    handleEvent(event: Event): void {
        setCurrentEvent(event);
        const result = this.expression(this.source, this.context!);
        setCurrentEvent(null);

        if (result !== true) {
            event.preventDefault();
        }
    }
}
