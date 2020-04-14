import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { Subtract } from "utility-types";
import {
    Page as BasePage,
    PageHandledProps as BasePageHandledProps,
    PageProps as BasePageProps,
    PageClassNamesContract,
    PageManagedClasses,
    PageUnhandledProps,
} from "./page";

const Page = manageJss()(BasePage);
type Page = typeof Page;

type PageHandledProps = Subtract<BasePageHandledProps, PageManagedClasses>;
type PageProps = ManagedJSSProps<BasePageProps, PageClassNamesContract, undefined>;

export { Page, PageProps, PageHandledProps, PageUnhandledProps, PageClassNamesContract };
