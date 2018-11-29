import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CardHandledProps,
    CardManagedClasses,
    CardTag,
    CardUnhandledProps,
} from "./card.props";
import {
    CardClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

class Card extends Foundation<CardHandledProps, CardUnhandledProps, {}> {
    public static displayName: string = "Card";

    protected handledProps: HandledProps<CardHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        tag: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement | HTMLElement> {
        return (
            <this.tag {...this.unhandledProps()} className={this.generateClassNames()}>
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
    private get tag(): any {
        return CardTag[this.props.tag] || CardTag.div;
    }
}

export default Card;
export * from "./card.props";
export { CardClassNameContract };
