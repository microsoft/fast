import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import style, { ICSSPositionClassNameContract } from "./position.style";

export enum PositionValue {
    static = "static",
    absolute = "absolute"
}

export enum Location {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom"
}

export interface ICSSPositionProps {
    position?: PositionValue;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    onChange: (positionValues: any) => void;
}

class CSSPosition extends React.Component<ICSSPositionProps & IManagedClasses<ICSSPositionClassNameContract>, {}> {
    private positionKey: string = "position";

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.cssPosition}>
                <span className={this.props.managedClasses.cssPosition_selectContainer}>
                    <select
                        className={this.props.managedClasses.cssPosition_selectContainer_select}
                        data-location={this.positionKey}
                        onChange={this.handleOnChange}
                        value={this.props.position ? this.props.position : PositionValue.static}
                    >
                        <option value={PositionValue.static}>Static</option>
                        <option value={PositionValue.absolute}>Absolute</option>
                    </select>
                </span>
                {this.renderControls(this.props.position)}
            </div>
        );
    }

    private renderControls(position?: PositionValue): JSX.Element {
        switch (position) {
            case PositionValue.absolute:
                return (
                    <div>
                        <div className={this.props.managedClasses.absoluteInput_row}>
                            <input
                                type="number"
                                className={this.props.managedClasses.cssPosition_input}
                                data-location={Location.top}
                                onChange={this.handleOnChange}
                                value={this.props.top || ""}
                            />
                        </div>
                        <div className={this.props.managedClasses.absoluteInput_row}>
                            <input
                                type="number"
                                className={this.props.managedClasses.cssPosition_input}
                                data-location={Location.left}
                                onChange={this.handleOnChange}
                                value={this.props.left || ""}
                            />
                            <div className={this.generateCenterRowClassNames()} />
                            <input
                                type="number"
                                className={this.props.managedClasses.cssPosition_input}
                                data-location={Location.right}
                                onChange={this.handleOnChange}
                                value={this.props.right || ""}
                            />
                        </div>
                        <div className={this.props.managedClasses.absoluteInput_row}>
                            <input
                                type="number"
                                className={this.props.managedClasses.cssPosition_input}
                                data-location={Location.bottom}
                                onChange={this.handleOnChange}
                                value={this.props.bottom || ""}
                            />
                        </div>
                    </div>
                );
            case PositionValue.static:
            default:
                return null;
        }
    }

    private generateCenterRowClassNames(): string {
        let classNames: string = this.props.managedClasses.absoluteInput_row_center;

        classNames = this.props.top ? `${classNames} ${this.props.managedClasses.absoluteInput_row_center__activeTop}` : classNames;
        classNames = this.props.bottom ? `${classNames} ${this.props.managedClasses.absoluteInput_row_center__activeBottom}` : classNames;
        classNames = this.props.left ? `${classNames} ${this.props.managedClasses.absoluteInput_row_center__activeLeft}` : classNames;
        classNames = this.props.right ? `${classNames} ${this.props.managedClasses.absoluteInput_row_center__activeRight}` : classNames;

        return classNames;
    }

    private handleOnChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
        const updatedProps: Partial<ICSSPositionProps> = this.assignUpdatedProps(
            [this.positionKey, Location.top, Location.left, Location.right, Location.bottom],
            e.target.dataset.location,
            e.target.value
        );

        this.props.onChange(updatedProps);
    }

    private assignUpdatedProps(props: string[], updatedPropKey: string, updatedPropValue: string): Partial<ICSSPositionProps> {
        let updatedProps: Partial<ICSSPositionProps> = {};

        switch (updatedPropKey) {
            case "position":
                updatedProps[updatedPropKey] = updatedPropValue as PositionValue;
                break;
            case Location.left:
            case Location.right:
            case Location.top:
            case Location.bottom:
                updatedProps = this.getUpdatedPositions(props, updatedPropKey, updatedPropValue);
                break;
        }

        return updatedProps;
    }

    private getUpdatedPositions(props: string[], updatedPropKey: string, updatedPropValue: string): Partial<ICSSPositionProps> {
        const updatedProps: Partial<ICSSPositionProps> = {};
        const excludedProp: Location = updatedPropKey === Location.left
            ? Location.right
            : updatedPropKey === Location.right
            ? Location.left
            : updatedPropKey === Location.top
            ? Location.bottom
            : Location.top;

        props.forEach((prop: string): void => {
            if (this.props[prop] && prop !== excludedProp) {
                updatedProps[prop] = this.props[prop];
            }
        });

        updatedProps[updatedPropKey] = parseInt(updatedPropValue, 10);

        return updatedProps;
    }
}

export default manageJss(style)(CSSPosition);
