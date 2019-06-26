import React from "react";
import addons, { makeDecorator, StoryContext, StoryGetter } from "@storybook/addons";
import { addDecorator, forceReRender, Channel } from "@storybook/react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystemDefaults,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { ADDON_EVENT } from "./constants";
import designSystemManager from "./design-system";

interface DesignSystemDecoratorProps {
    channel: ReturnType<typeof addons.getChannel>;
}

class DesignSystemDecorator<T> extends React.Component<
    DesignSystemDecoratorProps,
    { designSystem: DesignSystem | null }
> {
    constructor(props: DesignSystemDecoratorProps) {
        super(props);

        this.state = {
            designSystem: null,
        };
    }

    public componentDidMount(): void {
        this.props.channel.on(ADDON_EVENT, this.updateDesignSystem);
    }

    public componentWillUnmount(): void {
        this.props.channel.removeListener(ADDON_EVENT, this.updateDesignSystem);
    }

    public render(): React.ReactNode {
        if (this.state.designSystem === null) {
            console.log("Rendering without a design system");
            return this.props.children;
        }

        // Make sure body dir is set correctly
        document.body.dir = this.state.designSystem.direction;

        return (
            <DesignSystemProvider designSystem={this.state.designSystem}>
                {this.props.children}
            </DesignSystemProvider>
        );
    }

    private updateDesignSystem = (designSystem: DesignSystem) => {
        console.log("Updating design system in preview");
        this.setState({
            designSystem: Object.assign({}, designSystem),
        });
    };
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
    addDecorator(decorator);
}
