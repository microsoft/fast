import type { FASTElement, ViewTemplate } from "@microsoft/fast-element";
import type {
    AnnotatedStoryFn,
    Args,
    ComponentAnnotations,
    StoryAnnotations,
    StoryContext,
} from "@storybook/csf";
import qs from "qs";

/**
 * Returns a formatted URL for a given Storybook fixture.
 *
 * @param id - the Storybook fixture ID
 * @param args - Story args
 * @returns - the local URL for the Storybook fixture iframe
 */
export function fixtureURL(
    id: string = "debug--blank",
    args?: Record<string, any>
): string {
    const params: Record<string, any> = { id };
    if (args) {
        params.args = qs
            .stringify(args, {
                allowDots: true,
                delimiter: ";",
                format: "RFC1738",
                encode: false,
            })
            .replace(/=/g, ":")
            .replace(/\//g, "--");
    }

    const url = qs.stringify(params, {
        addQueryPrefix: true,
        format: "RFC1738",
        encode: false,
    });

    return url;
}

/**
 * A helper that returns a function to bind a Storybook story to a ViewTemplate.
 *
 * @param template - The ViewTemplate to render
 * @returns - a function to bind a Storybook story
 */
export function renderComponent<TArgs = Args>(
    template: ViewTemplate
): (args: TArgs, context: StoryContext) => Element | DocumentFragment | null {
    return function (args, { updateArgs }) {
        const storyFragment = new DocumentFragment();
        template.render({ ...args, updateArgs }, storyFragment);
        if (storyFragment.childElementCount === 1) {
            return storyFragment.firstElementChild;
        }
        return storyFragment;
    };
}

/**
 * A helper that returns a function to bind a Storybook story to a ViewTemplate.
 */
export type FASTFramework = {
    component: typeof FASTElement;
    storyResult: FASTElement | Element | DocumentFragment;
};

/**
 * Metadata to configure the stories for a component.
 */
export type Meta<TArgs = Args> = ComponentAnnotations<
    FASTFramework,
    Omit<TArgs, keyof FASTElement>
>;

/**
 * Story function that represents a CSFv3 component example.
 */
export declare type StoryObj<TArgs = Args> = StoryAnnotations<FASTFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 */
export declare type StoryFn<TArgs = Args> = AnnotatedStoryFn<FASTFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * NOTE that in Storybook 7.0, this type will be renamed to `StoryFn` and replaced by the current `StoryObj` type.
 */
export declare type Story<TArgs = Args> = StoryFn<StoryArgs<TArgs>>;

/**
 * Combined Storybook story args.
 */
export type StoryArgs<TArgs = Args> = Partial<Omit<TArgs, keyof FASTElement>> & Args;
