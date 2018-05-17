import * as React from "react";
import { IFoundationProps } from "./foundation.props";

abstract class Foundation<P, S> extends React.Component<IFoundationProps & P, S> {
    protected generateClassNames(classes: string = ""): string {
        return classes.concat(this.props.className || "");
    }
}

export default Foundation;
