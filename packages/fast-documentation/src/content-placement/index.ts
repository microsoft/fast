import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "../design-system";
import ContentPlacementStyles from "./content-placement.style";
import BaseContentPlacement, {
    ContentPlacementClassNameContract,
    ContentPlacementHandledProps as BaseContentPlacementHandledProps,
    ContentPlacementManagedClasses,
    ContentPlacementProps as BaseContentPlacementProps,
    ContentPlacementUnhandledProps
} from "./content-placement";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const ContentPlacement = manageJss(ContentPlacementStyles)(BaseContentPlacement);
type ContentPlacement = InstanceType<typeof ContentPlacement>;

interface ContentPlacementHandledProps
    extends Subtract<BaseContentPlacementHandledProps, ContentPlacementManagedClasses> {}
type ContentPlacementProps = ManagedJSSProps<
    BaseContentPlacementProps,
    ContentPlacementClassNameContract,
    DesignSystem
>;

export {
    ContentPlacement,
    ContentPlacementProps,
    ContentPlacementClassNameContract,
    ContentPlacementHandledProps,
    ContentPlacementUnhandledProps
};
