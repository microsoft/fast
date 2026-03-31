/* tslint:disable */
/* eslint-disable */

/**
 * Render a FAST HTML template with a JSON state string.
 * Returns the rendered HTML or throws a JavaScript error.
 */
export function render(entry: string, state: string): string;

/**
 * Render a FAST HTML template with custom element templates and a JSON state string.
 * `templates_json` is a JSON object mapping element names to their HTML template strings,
 * e.g. `{"my-button": "<template>...</template>"}`.
 * Returns the rendered HTML or throws a JavaScript error.
 */
export function render_with_templates(entry: string, templates_json: string, state: string): string;
