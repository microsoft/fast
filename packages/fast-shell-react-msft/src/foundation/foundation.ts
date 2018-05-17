import * as React from "react";
import { IFoundationProps } from "./foundation.props";

abstract class Foundation<P, S> extends React.Component<IFoundationProps & P, S> {
    protected handledProps: Partial<P>;
    protected generateClassNames(classes: string = ""): string {
        return this.props && this.props.className
            ? classes.concat(` ${this.props.className || ""}`).trim().replace(/(\s){2,}/g, " ")
            : "";
    }

    protected unhandledProps(): Partial<P> {
        return !this.props
        ? {}
        : Object.keys(this.props)
        .filter((key: string) => {
            return !this.handledProps.hasOwnProperty(key);
        })
        .reduce((accumulator: Partial<P>, key: string) => {
            accumulator[key] = this.props[key];

            return accumulator;
        }, {});
    }
}

export default Foundation;
