import * as React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    PivotHandledProps,
    PivotManagedClasses,
    PivotUnhandledProps,
} from "./pivot.props";
import { Tabs as BaseTabs } from "@microsoft/fast-components-react-base";

class Pivot extends Foundation<PivotHandledProps, PivotUnhandledProps, {}> {
    public static displayName: string = "Pivot";

    protected handledProps: HandledProps<PivotHandledProps> = {
        afterContent: void 0,
        label: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <BaseTabs
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={this.props.managedClasses}
                label={this.props.label}
            />
        );
    }
}

export default Pivot;
export * from "./pivot.props";
