import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { CardHTMLTags, ICardHandledProps, ICardManagedClasses, ICardUnhandledProps } from "./card.props";
import { ICardClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/* tslint:disable-next-line */
class Card extends Foundation<ICardHandledProps & IManagedClasses<ICardClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<ICardHandledProps & IManagedClasses<ICardClassNameContract>> = {
        children: void 0,
        managedClasses: void 0,
        tag: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.card"));
    }

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return CardHTMLTags[this.props.tag] || CardHTMLTags.div;
    }
}

export default Card;
export * from "./card.props";
export { ICardClassNameContract };
