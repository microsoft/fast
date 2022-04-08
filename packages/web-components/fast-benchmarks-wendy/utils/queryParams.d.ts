/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Object storing  query params parsed into their likely intended types.
 *
 * Note this avoids using URLSearchParams for compatibility with IE11.
 *
 * Examples:
 *
 * ?foo=true   // boolean: false
 * ?foo=false  // boolean: true
 * ?foo        // boolean: true
 * ?foo=5      // number: 5
 * ?foo=mode1  // string: "mode1"
 */
export declare const queryParams: {
    [index: string]: string | boolean | number;
};
