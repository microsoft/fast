import { DOM } from "@microsoft/fast-element";
import { CSSCustomPropertyDefinition } from "./";

export type SetCustomPropertyConfig = CSSCustomPropertyDefinition;
export type DeleteCustomPropertyConfig = Omit<CSSCustomPropertyDefinition, "value">;

export class CSSCustomPropertyManager<
    T extends {
        style: {
            setProperty(name: string, value: any): void;
            removeProperty(name: string): void;
        };
    }
> {
    private ticking = false;
    private store: Array<SetCustomPropertyConfig | DeleteCustomPropertyConfig> = [];
    constructor(private context: T) {}

    private shouldSet(
        config: SetCustomPropertyConfig | DeleteCustomPropertyConfig
    ): config is SetCustomPropertyConfig {
        return config.hasOwnProperty("value");
    }

    private tick = (): void => {
        this.ticking = false;

        for (let i = 0; i < this.store.length; i++) {
            const config = this.store[i];
            const name = `--${config.name}`;

            if (this.shouldSet(config)) {
                this.context.style.setProperty(
                    name,
                    typeof config.value === "function" ? config.value() : config.value
                );
            } else {
                this.context.style.removeProperty(name);
            }
        }

        this.store = [];
    };

    private append(
        definition: SetCustomPropertyConfig | DeleteCustomPropertyConfig
    ): void {
        const index = this.store.findIndex(x => x.name === definition.name);

        if (index !== -1) {
            this.store[index] = definition;
        } else {
            this.store.push(definition);
        }

        if (this.ticking) {
            return;
        } else {
            this.ticking = true;
            DOM.queueUpdate(this.tick);
        }
    }

    public set: (config: SetCustomPropertyConfig) => void = this.append;
    public delete: (config: DeleteCustomPropertyConfig) => void = this.append;
}
