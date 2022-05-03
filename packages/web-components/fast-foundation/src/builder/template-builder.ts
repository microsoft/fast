import { FASTElement, html, TemplateValue, ViewTemplate } from "@microsoft/fast-element";
import type {
    Anatomy,
    AnatomyConstructor,
    AnatomyContext,
    AnatomyContributor,
} from "./anatomy.js";

type ExtractComponentType<Type> = Type extends Anatomy<infer TComponent>
    ? TComponent
    : FASTElement;

type ExtractPartNames<Type> = Type extends Anatomy<any, infer PartNames>
    ? PartNames
    : string;

type CSSPartOptions<TPartNames extends string> =
    | boolean
    | TPartNames[]
    | ((name: TPartNames) => string | null)
    | Partial<Record<TPartNames, string>>;

interface InternalAnatomyContext<
    TComponent = FASTElement,
    TPartNames extends string = string
> extends AnatomyContext<TComponent, TPartNames> {
    contributors: AnatomyContributor<TComponent>[];
}

export class TemplateBuilder<TAnatomy extends Anatomy> {
    private _anatomy: TAnatomy | null = null;
    private _evaluatePartName: (
        input: ExtractPartNames<TAnatomy>
    ) => string | null = name => name;
    private _context: InternalAnatomyContext = {
        contributors: [],
        anatomy<T extends Anatomy>(
            AnatomyType: AnatomyConstructor<T>,
            callback: (a: T) => void
        ): T {
            const anatomy = new AnatomyType(this);

            anatomy["begin"]();
            callback(anatomy);
            anatomy["end"]({
                assert(condition: boolean, message: string) {
                    if (!condition) {
                        throw new Error(message);
                    }
                },
            });

            return anatomy;
        },
        addContributor(contributor) {
            this.contributors.push(contributor);
        },
        evaluatePartName: name => this._evaluatePartName(name as any),
        html(strings: TemplateStringsArray, ...values: TemplateValue<any>[]): void {
            this.addContributor({ strings, values });
            return this;
        },
    };

    public constructor(private readonly AnatomyType: AnatomyConstructor<TAnatomy>) {}

    public parts(options: CSSPartOptions<ExtractPartNames<TAnatomy>>): this {
        if (options === true) {
            this._evaluatePartName = name => name;
        } else if (options === false) {
            this._evaluatePartName = name => null;
        } else if (typeof options === "function") {
            this._evaluatePartName = options;
        } else if (Array.isArray(options)) {
            this._evaluatePartName = name => (options.includes(name) ? name : null);
        } else {
            this._evaluatePartName = name => {
                const mappedValue = options[name];
                return mappedValue ?? name;
            };
        }

        return this;
    }

    public anatomy(callback: (a: TAnatomy) => void): this {
        this._anatomy = this._context.anatomy(this.AnatomyType, callback);
        return this;
    }

    public build(): ViewTemplate<ExtractComponentType<TAnatomy>> {
        if (this._anatomy === null) {
            throw new Error("No anatomy defined.");
        }

        const context = this._context;

        const strings = context.contributors.reduce((a, v) => v.strings.concat(a), []);
        const values = context.contributors.reduce((a, v) => v.values.concat(a), []);

        return html((strings as unknown) as TemplateStringsArray, values);
    }
}

export function build<T extends Anatomy>(AnatomyType: AnatomyConstructor<T>) {
    return new TemplateBuilder<T>(AnatomyType);
}
