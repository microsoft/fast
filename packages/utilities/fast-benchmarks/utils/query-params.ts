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
export const queryParams: {
    [index: string]: string | boolean | number;
} = document.location.search
    .slice(1)
    .split("&")
    .filter(s => s)
    .map(p => p.split("="))
    .reduce(
        (p: { [key: string]: string | boolean }, [k, v]) => (
            (p[k] = (() => {
                try {
                    return JSON.parse(v);
                } catch {
                    return v || true;
                }
            })()),
            p
        ),
        {}
    );
