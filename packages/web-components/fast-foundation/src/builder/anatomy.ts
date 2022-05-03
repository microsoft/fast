import {
    Constructable,
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
    evaluateAnatomy<K extends Constructable<Anatomy>>(
        AnatomyType: K,
        callback: (a: InstanceType<K>) => void
    ): InstanceType<K>;
}

export interface AnatomyInternals<TPartNames extends string = string> {
    part(name: TPartNames): HTMLDirective;
    slot(options: Partial<SlotOptions>, ...slotBehaviors: TemplateValue<any>[]): void;
    evaluateAnatomy<K extends Constructable<Anatomy>>(
        AnatomyType: K,
        callback: (a: InstanceType<K>) => void
    ): InstanceType<K>;
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

export class Anatomy<TComponent = FASTElement, TPartNames extends string = string> {
    private _internals: AnatomyInternals;

    protected get internals(): AnatomyInternals {
        return this._internals;
    }

    constructor(private readonly context: AnatomyContext) {
        this._internals = {
            part(name: TPartNames): HTMLDirective {
                return new PartNameDirective(context, name);
            },
            evaluateAnatomy<K extends Constructable<Anatomy>>(
                AnatomyType: K,
                callback: (a: InstanceType<K>) => void
            ): InstanceType<K> {
                return context.evaluateAnatomy(AnatomyType, callback);
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

    protected openCallback() {}
    protected closeCallback() {}
    protected validateCallback(validator: AnatomyValidator) {}
}
