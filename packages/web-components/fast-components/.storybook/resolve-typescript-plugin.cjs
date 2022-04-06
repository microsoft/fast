/**
 * This file contains the distributed content of
 * https://www.npmjs.com/package/resolve-typescript-plugin
 * version 1.1.5.
 *
 * resolve-typescript-plugin requires a peer of webpack^5.0.0,
 * but this package cannot update the webpack dependency because
 * istanbul-instrumenter-loader requires webpack^[2.0.0-4.0.0]. This
 * resolver code here though, so we can include the source content,
 * avoiding npm errors on install because of peer dependency
 * version mismatches.
 *
 * This file can be removed, and the resolve-typescript-plugin used
 * directly, when this package upgrades to webpack^5.0.0.
 */
"use strict";
const pluginName = "ResolveTypescriptPlugin";
class ResolveTypescriptPlugin {
    constructor(options = {}) {
        this.options = Object.assign(Object.assign({}, ResolveTypescriptPlugin.defaultOptions), options);
    }
    apply(resolver) {
        const target = resolver.ensureHook("file");
        for (const extension of [".ts", ".tsx"]) {
            resolver
                .getHook("raw-file")
                .tapAsync(pluginName, (request, resolveContext, callback) => {
                var _a, _b;
                if (typeof request.path !== "string" ||
                    (!((_a = this.options.includeNodeModules) !== null && _a !== void 0 ? _a : false) &&
                        request.path.match(/(^|[\\/])node_modules($|[\\/])/u) != null)) {
                    callback();
                    return;
                }
                const path = request.path.replace(/\.jsx?$/u, extension);
                if (path === request.path) {
                    callback();
                }
                else {
                    resolver.doResolve(target, Object.assign(Object.assign({}, request), { path, relativePath: (_b = request.relativePath) === null || _b === void 0 ? void 0 : _b.replace(/\.jsx?$/u, extension) }), `using path: ${path}`, resolveContext, callback);
                }
            });
        }
    }
}
/** @deprecated For backwards compatibility with versions < v1.1.2.
 * Will be removed in v2.0. */
ResolveTypescriptPlugin.default = ResolveTypescriptPlugin;
ResolveTypescriptPlugin.defaultOptions = {
    includeNodeModules: false
};
module.exports = ResolveTypescriptPlugin;
