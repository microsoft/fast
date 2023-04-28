/**
 * This is a special story that allows us to load a blank preview page for
 * playwright tests which need to generate elements and insert them directly,
 * rather than start with a pre-determined element.
 */

import type { Meta } from "../src/__test__/helpers.js";

export default {
    title: "Debug",
} as Meta;

export const Blank = () => "";
