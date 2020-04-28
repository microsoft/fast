import React from "react";
import manageJss, {
    ComponentStyleSheet,
    ManagedClasses,
} from "@microsoft/fast-jss-manager-react";
import { uniqueId } from "lodash-es";

export interface SelectedComponentIndicatorClassNameContract {
    selectedComponentIndicator: string;
    selectedComponentIndicator__active: string;
    selectedComponentIndicator_tick: string;
    selectedComponentIndicator__preselect: string;
}

export interface SelectedComponentIndicatorProps
    extends ManagedClasses<SelectedComponentIndicatorClassNameContract> {
    x: number;
    y: number;
    width: number;
    height: number;
    active: boolean;
    preselect: boolean;
}
const topLeft: string = "&:nth-child(1)";
const topRight: string = "&:nth-child(2)";
const rightTop: string = "&:nth-child(3)";
const rightBottom: string = "&:nth-child(4)";
const bottomRight: string = "&:nth-child(5)";
const bottomLeft: string = "&:nth-child(6)";
const leftBottom: string = "&:nth-child(7)";
const leftTop: string = "&:nth-child(8)";

export const SelectedComponentIndicator = React.forwardRef(
    (props: SelectedComponentIndicatorProps, ref: React.RefObject<HTMLDivElement>) => {
        return React.createElement(
            manageJss({
                selectedComponentIndicator: {
                    position: "fixed",
                    border: "1px solid #FB356D",
                    boxSizing: "border-box",
                    pointerEvents: "none",
                    opacity: "0",
                    "&$selectedComponentIndicator__preselect&$selectedComponentIndicator__active": {
                        opacity: "1",
                    },
                },
                selectedComponentIndicator__active: {
                    opacity: "1",
                },
                selectedComponentIndicator_tick: {
                    position: "absolute",
                    width: "0px",
                    height: "8px",
                    borderLeft: "1px solid #FB356D",
                    boxSizing: "border-box",
                    [`${rightTop}, ${rightBottom}, ${leftBottom}, ${leftTop}`]: {
                        transformOrigin: "left top",
                        transform: "rotate(-90deg)",
                    },
                    [topLeft]: {
                        left: "0",
                        top: "-11px",
                    },
                    [topRight]: {
                        right: "0",
                        top: "-11px",
                    },
                    [rightTop]: {
                        right: "-4px",
                        top: "0",
                    },
                    [rightBottom]: {
                        right: "-4px",
                        bottom: "-9px",
                    },
                    [bottomRight]: {
                        right: "0",
                        bottom: "-11px",
                    },
                    [bottomLeft]: {
                        left: "0",
                        bottom: "-11px",
                    },
                    [leftBottom]: {
                        left: "-11px",
                        bottom: "-9px",
                    },
                    [leftTop]: {
                        left: "-11px",
                        top: "0",
                    },
                },
                selectedComponentIndicator__preselect: {
                    opacity: ".2",
                },
            })(
                (props: SelectedComponentIndicatorProps): JSX.Element => {
                    const managedClasses: SelectedComponentIndicatorClassNameContract = props.managedClasses as SelectedComponentIndicatorClassNameContract;

                    return (
                        <div
                            className={[
                                managedClasses.selectedComponentIndicator,
                                props.active
                                    ? managedClasses.selectedComponentIndicator__active
                                    : "",
                                props.preselect
                                    ? managedClasses.selectedComponentIndicator__preselect
                                    : "",
                            ].join(" ")}
                            style={{
                                top: Math.round(props.y),
                                left: Math.round(props.x),
                                width: Math.round(props.width),
                                height: Math.round(props.height),
                            }}
                            ref={ref}
                            key={uniqueId("indicator")}
                        >
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                            <div
                                className={managedClasses.selectedComponentIndicator_tick}
                            />
                        </div>
                    );
                }
            ),
            props
        );
    }
);
