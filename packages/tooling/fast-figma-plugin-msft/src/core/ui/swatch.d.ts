import React from "react";
interface SwatchManagedClasses {
    swatch: string;
}
interface SwatchProps extends React.HTMLAttributes<HTMLSpanElement> {
    color: string;
    managedClasses: SwatchManagedClasses;
}
declare const _default: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        SwatchProps,
        SwatchManagedClasses,
        SwatchProps
    >,
    any
>;
export default _default;
