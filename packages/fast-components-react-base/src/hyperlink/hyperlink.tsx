import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import {HyperlinkHTMLTags, IHyperlinkProps} from "./Hyperlink.props";
import {IHyperlinkClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/* tslint:disable-next-line */
class Hyperlink extends Foundation<IHyperlinkProps & IManagedClasses<IHyperlinkClassNameContract>,  React.AllHTMLAttributes<HTMLAnchorElement>, {}> {
    protected handledProps: HandledProps<IHyperlinkProps & IManagedClasses<IHyperlinkClassNameContract>> = {
        managedClasses: void 0,
        tag: void 0
    };

    protected defaultProps: IHyperlinkProps = {
        tag: HyperlinkHTMLTags.a
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return this.generateHTMLTag();
    }

    private generateAttributes() {
        let attributes = {};

        if (this.props.href)
            attributes['href'] = this.props.href;

        return attributes;
    }
    
    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLAnchorElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                {...this.generateAttributes()}
            >
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.hyperlink);
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        switch (this.props.tag) {
            case HyperlinkHTMLTags.a:
                return "a";
            default:
                return "a";
        }
    }
}

export default Hyperlink;
export {IHyperlinkProps, IHyperlinkClassNameContract, HyperlinkHTMLTags};
