import { html } from "@microsoft/fast-element";
import { Divider } from "./divider";

export const DividerTemplate = html<Divider>`<template role=${x => x.role}></template>`;
