import * as React from "react";

export interface IComponentWrapperState {
    showForm: boolean;
}

/**
 * The component wrapper interface
 */
export interface IComponentWrapperProps {
    /**
     * The component that maps to the schema
     * @type {JSX.Element}
     */
    component: any;

    /**
     * Schema for the schema form
     * @type {any}
     */
    schema: any;

    /**
     * Initial data to start with when rendering the component
     */
    data: any;

    /**
     * The onChange event to be passed
     */
    onChange: any;

    /**
     * The change event to a different component
     */
    onChangeComponent: any;

    /**
     * Changes the location
     */
    onChangeLocation: any;

    /**
     * The function to open the pane
     */
    openExtendedControls: any;

    /**
     * The other components/modules that can be selected
     */
    options: any[];
}

/**
 * Component wrapper component definition
 * @extends React.Component
 */
class ComponentWrapper extends React.Component<IComponentWrapperProps, IComponentWrapperState> {

    constructor(props: IComponentWrapperProps) {
        super(props);

        this.state = {
            showForm: false
        };
    }

    /**
     * Renders the component
     * @return {function}
     */
    public render(): JSX.Element {
        return (
            <div>
                <this.props.component {...this.props.data} />
            </div>
        );
    }
}

export default ComponentWrapper;
