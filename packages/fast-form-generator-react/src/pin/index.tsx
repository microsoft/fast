import * as React from "react";

export interface IPinProps {
    /**
     * The HTML id attribute
     */
    id?: string;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The pinned state
     */
    pinned?: boolean;

    /**
     * The onClick event handler
     */
    onClick?: (event?: React.MouseEvent<HTMLElement>) => void;

    /**
     * The onKeyPress event handler
     */
    onKeyPress?: (event?: React.KeyboardEvent<HTMLElement>) => void;
}

/**
 * Pin component definition
 * @extends React.Component
 */
class Pin extends React.Component<IPinProps, {}> {

    /**
     * Define default props
     */
    protected static defaultProps: IPinProps = {
        pinned: false,
        disabled: false,
        id: void(0),
        onClick: void(0),
        onKeyPress: void(0)
    };

    public render(): JSX.Element {
        return (
            <button className={this.generateClassNames()} {...this.generateAttributes()} />
        );
    }

    private generateClassNames(): string {
        return `fw-utils-pin${this.props.pinned ? "" : " o-untoggled o-delay" }`;
    }

    private generateAttributes(): IPinProps {
        const attributes: Partial<IPinProps> = {};

        if (this.props.disabled) {
            attributes.disabled = this.props.disabled;
        }

        if (this.props.onClick) {
            attributes.onClick = this.props.onClick;
        }

        if (this.props.onKeyPress) {
            attributes.onKeyPress = this.props.onKeyPress;
        }

        if (this.props.id) {
            attributes.id = this.props.id;
        }

        return attributes;
    }
}

export default Pin;
