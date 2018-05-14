import * as React from "react";

/**
 * The Grid Container. This element wraps all other grid elements.
 * @name Container
 * @extends BaseComponent
 */
class Container extends React.Component<undefined, undefined> {
    /**
     * Renders the Container markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                // TODO {...this.unhandledProps()}
                data-grid-app="container"
            >
                {this.props.children}
            </div>
        );
    }
}

export default Container;
