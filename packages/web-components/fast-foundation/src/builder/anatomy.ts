import {
    FASTElement,
    htmlDirective,
    HTMLDirective,
    TemplateValue,
    ViewTemplate,
} from "@microsoft/fast-element";

export interface AnatomyContributor<TComponent> {
    strings: TemplateStringsArray;
    values: TemplateValue<TComponent>[];
}

export interface AnatomyContext<
    TComponent = FASTElement,
    TPartNames extends string = string
> {
    html(strings: TemplateStringsArray, ...values: TemplateValue<TComponent>[]): void;
    addContributor(contributor: AnatomyContributor<TComponent>): void;
    evaluatePartName(name: TPartNames): string | null;
    anatomy<T extends Anatomy>(
        AnatomyType: AnatomyConstructor<T>,
        callback: (a: T) => void
    ): T;
}

export interface AnatomyInternals<
    TComponent = FASTElement,
    TPartNames extends string = string
> {
    part(name: TPartNames): HTMLDirective;
    slot(options: Partial<SlotOptions>, ...slotBehaviors: TemplateValue<any>[]): void;
    anatomy<T extends Anatomy>(
        AnatomyType: AnatomyConstructor<T>,
        callback: (a: T) => void
    ): T;
}

export interface AnatomyValidator {
    assert(condition: boolean, message: string): void;
}

export interface SlotOptions {
    name: string;
    fallback: string | ViewTemplate;
}

@htmlDirective()
class PartNameDirective implements HTMLDirective {
    constructor(private context: AnatomyContext, private originalName: string) {}

    createHTML(): string {
        const result = this.context.evaluatePartName(this.originalName);

        return result ? ` name="${result}" ` : "";
    }
}

export interface AnatomyConstructor<T extends Anatomy> {
    new (context: AnatomyContext): T;
}

export class Anatomy<TComponent = FASTElement, TPartNames extends string = string> {
    private _internals: AnatomyInternals<TComponent, TPartNames>;

    protected get internals(): AnatomyInternals<TComponent, TPartNames> {
        return this._internals;
    }

    constructor(private readonly context: AnatomyContext<TComponent, TPartNames>) {
        this._internals = {
            part(name: TPartNames): HTMLDirective {
                return new PartNameDirective(context, name);
            },
            anatomy<T extends Anatomy>(
                AnatomyType: AnatomyConstructor<T>,
                callback: (a: T) => void
            ): T {
                return context.anatomy(AnatomyType, callback);
            },
            slot(options: Partial<SlotOptions>, ...slotBehaviors: TemplateValue<any>[]) {
                const firstArgIsBehavior = !!HTMLDirective.getForInstance(options);

                const normalized = firstArgIsBehavior
                    ? { name: "", fallback: "" }
                    : Object.assign({ name: "", fallback: "" }, options);

                if (normalized.name) {
                    context.html`<slot name="${normalized.name}"`;
                } else {
                    context.html`<slot`;
                }

                if (firstArgIsBehavior) {
                    context.html` ${options}`;
                }

                for (const behavior of slotBehaviors) {
                    context.html` ${behavior}`;
                }

                if (normalized.fallback) {
                    context.html`>${normalized.fallback}</slot>`;
                } else {
                    context.html`></slot>`;
                }
            },
        };
    }

    html(strings: TemplateStringsArray, ...values: TemplateValue<TComponent>[]): this {
        this.context.html(strings, ...values);
        return this;
    }

    protected begin() {}
    protected end(validator: AnatomyValidator) {}
}
