import { html } from "@microsoft/fast-element";
import { Divider } from "./divider";

/**
 * The template for the {@link @microsoft/fast-foundation#Divider} component.
 * @public
 */
export const DividerTemplate = html<Divider>`<template role=${x => x.role}></template>`;
