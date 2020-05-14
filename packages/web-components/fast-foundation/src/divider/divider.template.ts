import { html } from "@microsoft/fast-element";
import { Divider } from "./divider.js";

export const DividerTemplate = html<Divider>`<template role=${x => x.role}></template>`;
