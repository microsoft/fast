import { HTMLDirective, DOM } from "@microsoft/fast-element";
import { Router } from "./router";
/**
 * @alpha
 */
export function isNavigationPhaseContributor(object, phase) {
    return phase in object;
}
const defaultOptions = {
    lifecycle: true,
    parameters: true,
};
class NavigationContributorDirective extends HTMLDirective {
    constructor(options) {
        super();
        this.options = options;
    }
    createPlaceholder(index) {
        return DOM.createCustomAttributePlaceholder("fast-navigation-contributor", index);
    }
    createBehavior(target) {
        return new NavigationContributorBehavior(target, this.options);
    }
}
class NavigationContributorBehavior {
    constructor(contributor, options) {
        this.contributor = contributor;
        this.options = options;
        this.router = null;
    }
    bind(source, context) {
        if (this.options.lifecycle) {
            this.router = context.router || Router.find(this.contributor);
            this.router.addContributor(this.contributor);
        }
        if (this.options.parameters) {
            const contributor = this.contributor;
            const routeParams = source;
            for (const key in routeParams) {
                contributor[key] = routeParams[key];
            }
        }
    }
    unbind(source) {
        if (this.router !== null) {
            this.router.removeContributor(this.contributor);
        }
    }
}
/**
 * @alpha
 */
export function navigationContributor(options) {
    return new NavigationContributorDirective(Object.assign({}, defaultOptions, options));
}
