import { ViewTemplate } from "@microsoft/fast-element";
import type { ComponentAnnotations } from "@storybook/csf";
import type { Args } from "@storybook/addons";

export type renderComponent = (template: ViewTemplate) => ComponentAnnotations<any, Args>;

/**
 * A helper that returns a function to bind a Storybook story to a ViewTemplate.
 *
 * @param template - The ViewTemplate to render
 * @returns - a function to bind a Storybook story
 */
export const renderComponent = (template: ViewTemplate) => {
    return function (args: Args) {
        const storyFragment = new DocumentFragment();
        template.render(args, storyFragment);
        return storyFragment;
    };
};
