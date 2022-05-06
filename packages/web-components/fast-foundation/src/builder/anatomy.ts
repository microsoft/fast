import {
    AddViewBehaviorFactory,
    FASTElement,
    htmlDirective,
    HTMLDirective,
    TemplateValue,
    ViewTemplate,
} from "@microsoft/fast-element";
import { TemplateBuilder } from "./template-builder.js";

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
    slot(
        options: Partial<SlotOptions>,
        ...slotBehaviors: TemplateValue<any>[]
    ): HTMLDirective;
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

@htmlDirective()
class SlotDirective implements HTMLDirective {
    constructor(
        private options: Partial<SlotOptions>,
        private slotDirectives: TemplateValue<any>[]
    ) {}

    createHTML(add: AddViewBehaviorFactory): string {
        let html = "";

        if (this.options.name) {
            html += `<slot name="${this.options.name}"`;
        } else {
            html += `<slot`;
        }

        for (const behavior of this.slotDirectives) {
            html += ` ` + (behavior as HTMLDirective).createHTML(add);
        }

        if (this.options.fallback) {
            html += `>${this.options.fallback}</slot>`;
        } else {
            html += `></slot>`;
        }

        return html;
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
            slot(
                options: Partial<SlotOptions>,
                ...slotDirectives: TemplateValue<any>[]
            ): HTMLDirective {
                const firstArgIsBehavior = !!HTMLDirective.getForInstance(this.options);
                const normalized = firstArgIsBehavior
                    ? { name: "", fallback: "" }
                    : Object.assign({ name: "", fallback: "" }, this.options);

                if (firstArgIsBehavior) {
                    slotDirectives.unshift(options);
                }

                return new SlotDirective(normalized, slotDirectives);
            },
        };
    }

    html(strings: TemplateStringsArray, ...values: TemplateValue<TComponent>[]): this {
        this.context.html(strings, ...values);
        return this;
    }

    protected begin() {}
    protected end(validator: AnatomyValidator) {}

    public static define<This extends AnatomyConstructor<Anatomy>>(
        this: This
    ): TemplateBuilder<InstanceType<This>> {
        return new TemplateBuilder(this as any);
    }
}
