import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Page as BasePage,
    PageClassNamesContract,
    PageHandledProps as BasePageHandledProps,
    PageManagedClasses,
    PageProps as BasePageProps,
    pageStyleSheet,
    PageUnhandledProps,
} from "./page";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Page = manageJss(pageStyleSheet)(BasePage);
type Page = typeof Page;

interface PageHandledProps extends Subtract<BasePageHandledProps, PageManagedClasses> {}
type PageProps = ManagedJSSProps<BasePageProps, PageClassNamesContract, undefined>;

export { Page, PageProps, PageHandledProps, PageUnhandledProps, PageClassNamesContract };
