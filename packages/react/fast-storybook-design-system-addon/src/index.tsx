import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { DesignSystemProvider, JSSManager } from "@microsoft/fast-jss-manager-react";
import addons, { makeDecorator, StoryContext, StoryGetter } from "@storybook/addons";
import { addDecorator } from "@storybook/react";
import React from "react";
import Channel from "@storybook/channels";
import { create } from "jss";
import jssNested from "jss-plugin-nested";
import { REQUEST_DESIGN_SYSTEM_EVENT, UPDATE_DESIGN_SYSTEM_EVENT } from "./constants";

const jssInstance: ReturnType<create> = create();
jssInstance.use(jssNested());
JSSManager.jss = jssInstance;

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
        this.props.channel.addListener(
            UPDATE_DESIGN_SYSTEM_EVENT,
            this.updateDesignSystem
        );
    }

    public componentWillUnmount(): void {
        this.props.channel.removeListener(
            UPDATE_DESIGN_SYSTEM_EVENT,
            this.updateDesignSystem
        );
    }

    public render(): React.ReactNode {
        if (this.state.designSystem === null) {
            this.props.channel.emit(REQUEST_DESIGN_SYSTEM_EVENT);
            return null;
        }

        // Make sure body dir is set correctly
        document.body.dir = this.state.designSystem.direction;

        return (
            <DesignSystemProvider designSystem={this.state.designSystem}>
                {this.props.children}
            </DesignSystemProvider>
        );
    }

    private updateDesignSystem = (designSystem: DesignSystem): void => {
        this.setState({
            designSystem: Object.assign({}, designSystem),
        });
    };
}

/* eslint-disable react/display-name */
const decorator: ReturnType<typeof makeDecorator> = makeDecorator({
    name: "withDesignSystem",
    parameterName: "designSystem",
    wrapper: (getStory: StoryGetter, context: StoryContext): ReturnType<StoryGetter> => {
        const channel: Channel = addons.getChannel();

        return (
            <DesignSystemDecorator channel={channel}>
                {getStory(context)}
            </DesignSystemDecorator>
        );
    },
});
/* eslint-enable react/display-name */

export function setup(): void {
    addDecorator(decorator);
}
