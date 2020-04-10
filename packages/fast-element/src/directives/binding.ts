import { Directive } from "./directive";
import { Expression } from "../interfaces";
import { ObservableExpression } from "../observation/observable";
import { DOM } from "../dom";
import { Behavior } from "./behavior";

function normalBind(this: BindingBehavior, source: unknown) {
    this.source = source;

    if (this.observableExpression === null) {
        this.observableExpression = new ObservableExpression(this.expression, this);
    }

    this.updateTarget(this.observableExpression.evaluate(source, context));
}

function triggerBind(this: BindingBehavior, source: unknown) {
    this.source = source;
    this.target.addEventListener(this.targetName!, this, true);
}

function normalUnbind(this: BindingBehavior) {
    this.observableExpression!.dispose();
    this.source = null;
}

function triggerUnbind(this: BindingBehavior) {
    this.target.removeEventListener(this.targetName!, this, true);
    this.source = null;
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

export class BindingDirective extends Directive {
    private cleanedTargetName?: string;
    private originalTargetName?: string;

    public createPlaceholder = DOM.createInterpolationPlaceholder;
    private bind: typeof normalBind = normalBind;
    private unbind: typeof normalUnbind = normalUnbind;
    private updateTarget: typeof updateAttributeTarget = updateAttributeTarget;

    constructor(public expression: Expression) {
        super();
    }

    public get targetName() {
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
                if (value === "class") {
                    this.cleanedTargetName = "className";
                    this.updateTarget = updatePropertyTarget;
                } else {
                    this.cleanedTargetName = value;
                }
                break;
        }
    }

    public makeIntoTextBinding() {
        this.updateTarget = updateTextTarget;
    }

    createBehavior(target: any) {
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

const context = {} as any;

export class BindingBehavior implements Behavior {
    public source: unknown = void 0;
    public observableExpression: ObservableExpression | null = null;

    constructor(
        public target: any,
        public expression: Expression,
        public bind: typeof normalBind,
        public unbind: typeof normalUnbind,
        public updateTarget: typeof updatePropertyTarget,
        public targetName?: string
    ) {}

    handleExpressionChange(): void {
        this.updateTarget(this.observableExpression!.evaluate(this.source, context));
    }

    handleEvent(event: Event) {
        const context = { event };
        const result = this.expression(this.source, context as any);

        if (result !== true) {
            event.preventDefault();
        }
    }
}
