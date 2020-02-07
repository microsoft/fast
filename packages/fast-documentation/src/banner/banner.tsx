import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button as BaseButton } from "@microsoft/fast-components-react-base";
import {
    Background,
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag,
    Paragraph,
    ParagraphProps,
    ParagraphSize
} from "@microsoft/fast-components-react-msft";
import { BannerHandledProps, BannerProps, BannerUnhandledProps } from "./banner.props";
import { buttonStyles } from "./banner.style";
import { get } from "lodash-es";
import manageJss from "@microsoft/fast-jss-manager-react";

const Button: any = manageJss(buttonStyles)(BaseButton);

class Banner extends Foundation<BannerHandledProps, BannerUnhandledProps, {}> {
    public static displayName: string = "Banner";

    public static defaultProps: Partial<BannerProps> = {
        backgroundColor: "#0078D4"
    };

    protected handledProps: HandledProps<BannerHandledProps> = {
        action: void 0,
        backgroundColor: void 0,
        title: void 0,
        tag: void 0,
        value: void 0,
        drawBackground: void 0,
        abstract: void 0,
        managedClasses: void 0,
        designSystemMergingFunction: void 0
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <Background
                {...this.generateAttributes()}
                tag={this.props.tag}
                value={this.props.backgroundColor}
                drawBackground={this.props.drawBackground}
                designSystemMergingFunction={this.props.designSystemMergingFunction}
            >
                <div className={get(this.props.managedClasses, "banner_contentRegion", "")}>
                    <Heading {...this.getTitleProps()} />
                    <Paragraph {...this.getAbstractProps()} />
                    <Button {...this.props.action} className={get(this.props.managedClasses, "banner_action", "")}>
                        <svg width="60" height="56" viewBox="0 0 60 56" xmlns="http://www.w3.org/2000/svg">
                            <path d="M59.8242 28L32.2559 55.5684L29.6191 52.9316L52.6758 29.875H0V26.125H52.6758L29.6191 3.06836L32.2559 0.431641L59.8242 28Z" />
                        </svg>
                    </Button>
                </div>
            </Background>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "banner", ""));
    }

    private getTitleProps(): HeadingProps {
        return Object.assign(
            {},
            {
                className: get(this.props.managedClasses, "banner_title", ""),
                size: HeadingSize._3,
                tag: HeadingTag.h3
            },
            this.props.title
        );
    }

    private getAbstractProps(): ParagraphProps {
        return Object.assign(
            {},
            {
                className: get(this.props.managedClasses, "banner_abstract", ""),
                size: ParagraphSize._3
            },
            this.props.abstract
        );
    }

    private generateAttributes(): React.HTMLAttributes<HTMLDivElement> {
        const attributes: React.HTMLAttributes<HTMLDivElement> = {
            ...this.unhandledProps(),
            className: this.generateClassNames()
        };

        return {
            ...attributes,
            style: {
                // attributes.style has to be spread here again in order to
                // merge the styles attribute, otherwise it is just overriden
                ...attributes.style
            }
        };
    }
}

export default Banner;
export * from "./banner.props";
