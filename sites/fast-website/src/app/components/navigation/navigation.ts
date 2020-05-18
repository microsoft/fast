import { FASTElement } from "@microsoft/fast-element";
import { applyMixins, StartEnd } from "@microsoft/fast-foundation";

export class Navigation extends FASTElement {}

/* eslint-disable-next-line */
export interface Navigation extends StartEnd {}
applyMixins(Navigation, StartEnd);
