import React from "react";
import addons, { makeDecorator, StoryContext, StoryGetter } from "@storybook/addons";
import { addDecorator, forceReRender } from "@storybook/react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystemDefaults,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { ADDON_EVENT } from "./constants";
import designSystemManager from "./design-system";

interface DesignSystemDecoratorProps {
    channel: any;
}

class DesignSystemDecorator<T> extends React.Component<
    DesignSystemDecoratorProps,
    { designSystem: unknown }
> {
    constructor(props: DesignSystemDecoratorProps) {
        super(props);

        this.state = {
            designSystem: designSystemManager.get(),
        };
    }

    public componentDidMount(): void {
        this.props.channel.on(ADDON_EVENT, () => {
            this.setState({
                designSystem: designSystemManager.get(),
            });
        });
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={this.state.designSystem}>
                {this.props.children}
            </DesignSystemProvider>
        );
    }

    private get designSystem(): DesignSystem {
        return JSON.parse(window.localStorage.getItem("design-system"));
    }
}

const decorator = makeDecorator({
    name: "withDesignSystem",
    parameterName: "designSystem",
    wrapper: (getStory: StoryGetter, context: StoryContext): ReturnType<StoryGetter> => {
        const channel = addons.getChannel();

        return (
            <DesignSystemDecorator channel={channel}>
                {getStory(context)}
            </DesignSystemDecorator>
        );
    },
});

export function setup() {
    designSystemManager.set(DesignSystemDefaults);

    console.log("SETUP");
    addDecorator(decorator);
}
