import {
    Constructable,
    ExecutionContext,
    HTMLView,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DesignSystem } from "@microsoft/fast-foundation";
import type {
    FoundationElementDefinition,
    FoundationElementRegistry,
} from "@microsoft/fast-foundation";
/**
 * Options used to customize the creation of the test fixture.
 */
export interface FixtureOptions {
    /**
     * The document to run the fixture in.
     * @defaultValue `globalThis.document`
     */
    document?: Document;
    /**
     * The parent element to append the fixture to.
     * @defaultValue An instance of `HTMLDivElement`.
     */
    parent?: HTMLElement;
    /**
     * The data source to bind the HTML to.
     * @defaultValue An empty object.
     */
    source?: any;
    /**
     * The execution context to use during binding.
     * @defaultValue {@link @microsoft/fast-element#defaultExecutionContext}
     */
    context?: ExecutionContext;
    /**
     * A pre-configured design system instance used in setting up the fixture.
     */
    designSystem?: DesignSystem;
}
export interface Fixture<TElement = HTMLElement> {
    /**
     * The document the fixture is running in.
     */
    document: Document;
    /**
     * The template the fixture was created from.
     */
    template: ViewTemplate;
    /**
     * The view that was created from the fixture's template.
     */
    view: HTMLView;
    /**
     * The parent element that the view was appended to.
     * @remarks
     * This element will be appended to the DOM only
     * after {@link Fixture.connect} has been called.
     */
    parent: HTMLElement;
    /**
     * The first element in the {@link Fixture.view}.
     */
    element: TElement;
    /**
     * Adds the {@link Fixture.parent} to the DOM, causing the
     * connect lifecycle to begin.
     * @remarks
     * Yields control to the caller one Microtask later, in order to
     * ensure that the DOM has settled.
     */
    connect(): Promise<void>;
    /**
     * Removes the {@link Fixture.parent} from the DOM, causing the
     * disconnect lifecycle to begin.
     * @remarks
     * Yields control to the caller one Microtask later, in order to
     * ensure that the DOM has settled.
     */
    disconnect(): Promise<void>;
}
/**
 * Creates a random, unique name suitable for use as a Custom Element name.
 */
export declare function uniqueElementName(): string;
/**
 * Creates a test fixture suitable for testing custom elements, templates, and bindings.
 * @param templateNameOrRegistry An HTML template or single element name to create the fixture for.
 * @param options Enables customizing fixture creation behavior.
 * @remarks
 * Yields control to the caller one Microtask later, in order to
 * ensure that the DOM has settled.
 */
export declare function fixture<TElement = HTMLElement>(
    templateNameOrRegistry:
        | ViewTemplate
        | string
        | FoundationElementRegistry<FoundationElementDefinition, Constructable<TElement>>
        | [
              FoundationElementRegistry<
                  FoundationElementDefinition,
                  Constructable<TElement>
              >,
              ...FoundationElementRegistry<FoundationElementDefinition, Constructable>[]
          ],
    options?: FixtureOptions
): Promise<Fixture<TElement>>;
