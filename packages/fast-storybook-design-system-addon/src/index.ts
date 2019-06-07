import React from "react";
import { makeDecorator, StoryContext, StoryGetter } from "@storybook/addons";

export default makeDecorator({
    name: "withDesignSystem",
    parameterName: "designSystem",
    wrapper: (getStory: StoryGetter, context: StoryContext): ReturnType<StoryGetter> => {
        return getStory(context);
    },
});
