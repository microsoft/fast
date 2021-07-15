var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { defaultExecutionContext, ElementStyles, html } from "@microsoft/fast-element";
import { isFASTElementHost } from "./router";
/**
 * @alpha
 */
export const RouterExecutionContext = Object.freeze({
    create(router) {
        return Object.create(defaultExecutionContext, {
            router: {
                value: router,
            },
        });
    },
});
/**
 * @alpha
 */
export const Transition = Object.freeze({
    default: Object.freeze({
        begin(host, prev, next) {
            return __awaiter(this, void 0, void 0, function* () {});
        },
        rollback(host, prev, next) {
            return __awaiter(this, void 0, void 0, function* () {});
        },
        commit(host, prev, next) {
            return __awaiter(this, void 0, void 0, function* () {});
        },
    }),
});
/**
 * @alpha
 */
export class FASTElementLayout {
    constructor(template = null, styles = null, runBeforeCommit = true) {
        this.template = template;
        this.runBeforeCommit = runBeforeCommit;
        this.styles =
            styles === void 0 || styles === null
                ? null
                : Array.isArray(styles)
                ? ElementStyles.create(styles)
                : styles instanceof ElementStyles
                ? styles
                : ElementStyles.create([styles]);
    }
    beforeCommit(routerElement) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.runBeforeCommit) {
                this.apply(routerElement);
            }
        });
    }
    afterCommit(routerElement) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.runBeforeCommit) {
                this.apply(routerElement);
            }
        });
    }
    apply(routerElement) {
        if (isFASTElementHost(routerElement)) {
            if (routerElement.$fastController.template !== this.template) {
                routerElement.$fastController.template = this.template;
            }
            if (routerElement.$fastController.styles !== this.styles) {
                routerElement.$fastController.styles = this.styles;
            }
        }
    }
}
/**
 * @alpha
 */
export const Layout = Object.freeze({
    default: new FASTElementLayout(html`
        <slot></slot>
    `),
});
