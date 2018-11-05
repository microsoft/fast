import { JSSStyleSheet } from "./jss-manager";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { jss, stylesheetRegistry } from "./jss";

export type SheetTracker = [JSSStyleSheet, number];
export type DesignSystemRegistry = WeakMap<object, SheetTracker>;
export type SheetRegistry = WeakMap<
    ComponentStyles<unknown, unknown>,
    DesignSystemRegistry
>;

export interface JSSSheetOptions {
    meta?: string;
    index?: number;
}

/**
 * A class for managing instance of stylesheets. The SheetManager
 * tracks and associates compiled stylesheets with their style/design-system inputs,
 * as well as tracking number of times a style/design-system combination has been used.
 * Tracking this allows us to memoize compiled stylesheets and only compile a new sheet
 * when one does not already exist.
 */
export default class SheetManager {
    private registry: SheetRegistry = new WeakMap();

    /**
     * Creates a new JSS stylesheet from a stylesheet and design-system.
     * If a JSS style sheet has been created with this stylesheet and design system already,
     * then simply track that another instance has been added
     */
    public add(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: any,
        options?: JSSSheetOptions
    ): void {
        const tracker: SheetTracker | void = this.getTracker(styles, designSystem);

        if (Array.isArray(tracker)) {
            tracker[1]++;

            return;
        }

        let designSystemRegistry: DesignSystemRegistry | void = this.registry.get(styles);

        if (designSystemRegistry === undefined) {
            // If we don't have any design system instances for the current stylesheet,
            // we need to create a new map to store them
            designSystemRegistry = new WeakMap();
            this.registry.set(styles, designSystemRegistry);
        }

        this.registry
            .get(styles)
            .set(designSystem, [this.createStyleSheet(styles, designSystem, options), 1]);
    }

    /**
     * Return the compiled jss stylesheet associated with a given style object and design system
     */
    public get(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: any
    ): JSSStyleSheet | void {
        const tracker: SheetTracker | void = this.getTracker(styles, designSystem);

        if (Array.isArray(tracker) && !!tracker[0]) {
            return tracker[0];
        }

        return;
    }

    /**
     * Removes a reference for a stylesheet and designSystem and adds a new reference. Useful
     * when the design system changes and the stylesheet should be associated with a new
     * design system
     */
    public update(
        styles: ComponentStyles<unknown, unknown>,
        previousDesignSystem: any,
        nextDesignSystem: any
    ): void {
        const tracker: SheetTracker | void = this.getTracker(
            styles,
            previousDesignSystem
        );

        if (!tracker) {
            return;
        }

        /**
         * If we only have one sheet and this sheet isn't associated with the next design system, *and* it's an object,
         * we can simply update the sheet and move it's reference instead of completely tearing down the sheet and
         * re-creating a style element
         */
        if (
            tracker[1] === 1 &&
            !this.get(styles, nextDesignSystem) &&
            !!styles &&
            typeof styles === "object"
        ) {
            tracker[0].update(nextDesignSystem);
            this.registry.get(styles).delete(previousDesignSystem);
            this.registry.get(styles).set(nextDesignSystem, tracker);
        } else {
            this.remove(styles, previousDesignSystem);
            this.add(styles, nextDesignSystem, tracker[0].options);
        }
    }

    /**
     * Reduces the internal count for a stylesheet and designsystem. If the count becomes zero,
     * the sheet will be detached
     */
    public remove(styles: ComponentStyles<unknown, unknown>, designSystem: any): void {
        const tracker: SheetTracker | void = this.getTracker(styles, designSystem);

        if (Array.isArray(tracker)) {
            tracker[1]--;

            if (tracker[1] === 0) {
                const sheet: JSSStyleSheet = tracker[0];
                jss.removeStyleSheet(sheet);
                stylesheetRegistry.remove(sheet);

                this.registry.get(styles).delete(designSystem);
            }
        }
    }

    /**
     * Returns the number of components using a stylesheet with a designSystem
     */
    public count(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: object
    ): number {
        const tracker: SheetTracker | void = this.getTracker(styles, designSystem);

        if (Array.isArray(tracker)) {
            return tracker[1];
        }

        return -1;
    }

    /**
     * Removes all entries
     */
    public clean(): void {
        this.registry = new WeakMap();
    }

    /**
     * Retrieve the sheet tracker tracking the styles and design system
     */
    private getTracker(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: object
    ): SheetTracker | void {
        const designSystemRegistry: DesignSystemRegistry | void = this.registry.get(
            styles
        );

        if (designSystemRegistry instanceof WeakMap) {
            const tracker: SheetTracker | void = designSystemRegistry.get(designSystem);

            if (Array.isArray(tracker)) {
                return tracker;
            }
        }
    }

    /**
     * Creates a JSS StyleSheet and attaches it to the DOM
     */
    private createStyleSheet(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: any,
        options: JSSSheetOptions = {}
    ): JSSStyleSheet {
        const stylesheet: ComponentStyleSheet<unknown, unknown> =
            typeof styles === "function" ? styles(designSystem) : styles;

        const sheet: JSSStyleSheet = jss.createStyleSheet(stylesheet, {
            link: true,
            ...options,
        });

        sheet.attach().update(designSystem);
        stylesheetRegistry.add(sheet);

        return sheet;
    }
}
