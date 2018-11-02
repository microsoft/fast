import { JSSStyleSheet } from "./jss-manager";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { SheetTracker } from "./tracker";
import { jss, stylesheetRegistry } from "./jss";

/**
 * Registry class would expose simple API for associating design systems, use counts, and style objects
 * @method create(styles, designSystem)
 * @description creates a new association if one doesn't exit. If one does exist, it simply increments the
 * count.
 *
 * @method read(styles, designSystem)
 * @description retrieves the JSS sheet mapping to both styles and designSystem
 *
 *
 * @method update(styles, previousDesignSystem, nextDesignSystem)
 * @description Associates the stylesheet with a different design system
 *
 * @method delete(styles, designSystem)
 * @description decrements a count for a set of stylesheets. If the count becomes 0,
 * the sheet is removed from the DOM
 */

export type DesignSystemRegistry = WeakMap<object, SheetTracker>;
export type SheetRegistry = WeakMap<
    ComponentStyles<unknown, unknown>,
    DesignSystemRegistry
>;

export default class SheetManager {
    private registry: SheetRegistry = new WeakMap();

    /**
     * Adds a stylesheet and design system. If this combination does not exist, it will create and
     * attach the sheet. Otherwise, it will increment the internal count
     */
    public add(styles: ComponentStyles<unknown, unknown>, designSystem: object): void {
        const existingTracker: SheetTracker | void = this.getTracker(
            styles,
            designSystem
        );

        if (existingTracker instanceof SheetTracker) {
            existingTracker.increment();

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
            .set(
                designSystem,
                new SheetTracker(this.createStyleSheet(styles, designSystem))
            );
    }

    /**
     * Return the compiled jss stylesheet associated with a given style object and design system
     */
    public get(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: object
    ): JSSStyleSheet | void {
        const tracker: SheetTracker | void = this.getTracker(styles, designSystem);

        if (tracker instanceof SheetTracker && !!tracker.sheet) {
            return tracker.sheet;
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
        previousDesignSystem: object,
        nextDesignSystem: object
    ): void {
        this.remove(styles, previousDesignSystem);
        this.add(styles, nextDesignSystem);
    }

    /**
     * Reduces the internal count for a stylesheet and designsystem. If the count becomes zero,
     * the sheet will be detached
     */
    public remove(styles: ComponentStyles<unknown, unknown>, designSystem: object): void {
        const tracker: SheetTracker | void = this.getTracker(styles, designSystem);

        if (tracker instanceof SheetTracker) {
            tracker.decrement();

            if (tracker.count === 0) {
                jss.removeStyleSheet(tracker.sheet);
                stylesheetRegistry.remove(tracker.sheet);

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

        if (tracker instanceof SheetTracker) {
            return tracker.count;
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

            if (tracker instanceof SheetTracker) {
                return tracker;
            }
        }
    }

    /**
     * Creates a JSS StyleSheet and attaches it to the DOM
     */
    private createStyleSheet(
        styles: ComponentStyles<unknown, unknown>,
        designSystem: object
    ): JSSStyleSheet {
        const stylesheet: ComponentStyleSheet<unknown, unknown> =
            typeof styles === "function" ? styles(designSystem) : styles;

        // Create the stylesheet and
        const sheet: JSSStyleSheet = jss.createStyleSheet(styles, {
            link: true,
            index: 0, // TODO how do we get index?
        });

        sheet.attach().update(designSystem);
        stylesheetRegistry.add(sheet);

        return sheet;
    }
}
