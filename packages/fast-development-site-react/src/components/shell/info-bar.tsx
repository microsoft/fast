import * as React from "react";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps
} from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../design-system";

/* tslint:disable-next-line */
export interface ShellInfoBarProps {}

export interface ShellInfoBarManagedClasses {
    shellInfoBar: string;
}

const style: ComponentStyles<ShellInfoBarManagedClasses, DevSiteDesignSystem> = {
    shellInfoBar: {
        display: "flex",
        background: "#E9ECEC",
        cursor: "default",
        minHeight: (config: DevSiteDesignSystem): string => {
            return toPx(config.navigationBarHeight / 2);
        }
    }
};

class ShellInfoBar extends React.Component<
    ShellInfoBarProps & ManagedClasses<ShellInfoBarManagedClasses>,
    {}
> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.shellInfoBar}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(ShellInfoBar);
