/* tslint:disable */
import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import {
    FastElement,
    observable,
    Observable,
    attr,
    FastElementDefinition,
} from "@microsoft/fast-element";
import { composedParent } from "../utilities";

function designSystem(source: any, target: string) {
    if (!source.hasOwnProperty("designSystemProperties")) {
        source.designSystemProperties = [];
    }

    source.designSystemProperties.push(target);
}

export class DesignSystemProvider extends FastElement {
    @attr({ attribute: "background-color" })
    @designSystem
    public backgroundColor: string;

    @observable
    public designSystem: any = {};

    private provider: DesignSystemProvider | null = null;

    /**
     * Track all design system property names so we can react to changes
     * in those properties. Do not initialize or it will clobber vlaues stored
     * by the decorator
     */
    private designSystemProperties: string[];

    public connectedCallback() {
        super.connectedCallback();
        const provider = this.findProvider();

        if (!!provider) {
            this.provider = provider;
            Observable.getNotifier(this.provider).subscribe(this, "designSystem");
        }

        this.designSystem = this.collectDesignSystem();

        const notifier = Observable.getNotifier(this);
        this.designSystemProperties.forEach(property => {
            notifier.subscribe(this, property);
        });
    }

    /**
     * Invoked when the parent provider's design-system object changes
     * or when any property defined as a design-system property is changed.
     * Will update the designSystem object
     * @param source The source object changing
     * @param key The property of the source object that changed
     */
    public handleChange(source, key) {
        this.designSystem = this.collectDesignSystem();
    }

    /**
     * Find the parent DesignSystem provider.
     * TODO: We'll likely want to share this with the recipe consumer
     */
    public findProvider(): DesignSystemProvider | null {
        let parent = composedParent(this as HTMLElement);

        while (parent !== null) {
            if (parent instanceof DesignSystemProvider) {
                return parent;
            } else {
                parent = composedParent(parent);
            }
        }

        return null;
    }

    /**
     * Pick all design-system properties of this instance
     * that are not null or undefined into an object
     */
    private collectLocalDesignSystem() {
        return this.designSystemProperties.reduce((prev, next) => {
            const value = this[next];
            if (value !== undefined && value !== null) {
                prev[next] = value;
            }

            return prev;
        }, {});
    }

    private collectDesignSystem() {
        return !!this.provider
            ? { ...this.provider.designSystem, ...this.collectLocalDesignSystem() }
            : this.collectLocalDesignSystem();
    }
}
