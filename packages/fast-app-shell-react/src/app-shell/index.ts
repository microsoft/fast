import {
    AppShell as BaseAppShell,
    AppShellColorModes,
    AppShellManagedClasses,
    AppShellProps as BaseAppShellProps,
} from "./app-shell";
import { AppShellClassNamesContract, styles } from "./app-shell.styles";
import manageJss from "@microsoft/fast-jss-manager-react";
import { Subtract } from "utility-types";

/* tslint:disable-next-line */
const AppShell = manageJss(styles)(BaseAppShell);
type AppShell = InstanceType<typeof AppShell>;

type AppShellProps = Subtract<BaseAppShellProps, AppShellManagedClasses>;
export { AppShell, AppShellColorModes, AppShellProps, AppShellClassNamesContract };
