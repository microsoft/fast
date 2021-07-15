import { DOM } from "../dom";
import { Observable } from "../observation/observable";
import { enableArrayObservation } from "../observation/array-observer";
import { emptyArray } from "../platform";
import { HTMLDirective } from "./html-directive";
import { HTMLView } from "./view";
const defaultRepeatOptions = Object.freeze({
    positioning: false,
});
function bindWithoutPositioning(view, items, index, context) {
    view.bind(items[index], context);
}
function bindWithPositioning(view, items, index, context) {
    const childContext = Object.create(context);
    childContext.index = index;
    childContext.length = items.length;
    view.bind(items[index], childContext);
}
/**
 * A behavior that renders a template for each item in an array.
 * @public
 */
export class RepeatBehavior {
    /**
     * Creates an instance of RepeatBehavior.
     * @param location - The location in the DOM to render the repeat.
     * @param itemsBinding - The array to render.
     * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
     * @param templateBinding - The template to render for each item.
     * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(
        location,
        itemsBinding,
        isItemsBindingVolatile,
        templateBinding,
        isTemplateBindingVolatile,
        options
    ) {
        this.location = location;
        this.itemsBinding = itemsBinding;
        this.templateBinding = templateBinding;
        this.options = options;
        this.source = null;
        this.views = [];
        this.items = null;
        this.itemsObserver = null;
        this.originalContext = void 0;
        this.childContext = void 0;
        this.bindView = bindWithoutPositioning;
        this.itemsBindingObserver = Observable.binding(
            itemsBinding,
            this,
            isItemsBindingVolatile
        );
        this.templateBindingObserver = Observable.binding(
            templateBinding,
            this,
            isTemplateBindingVolatile
        );
        if (options.positioning) {
            this.bindView = bindWithPositioning;
        }
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source, context) {
        this.source = source;
        this.originalContext = context;
        this.childContext = Object.create(context);
        this.childContext.parent = source;
        this.childContext.parentContext = this.originalContext;
        this.items = this.itemsBindingObserver.observe(source, this.originalContext);
        this.template = this.templateBindingObserver.observe(
            source,
            this.originalContext
        );
        this.observeItems(true);
        this.refreshAllViews();
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind() {
        this.source = null;
        this.items = null;
        if (this.itemsObserver !== null) {
            this.itemsObserver.unsubscribe(this);
        }
        this.unbindAllViews();
        this.itemsBindingObserver.disconnect();
        this.templateBindingObserver.disconnect();
    }
    /** @internal */
    handleChange(source, args) {
        if (source === this.itemsBinding) {
            this.items = this.itemsBindingObserver.observe(
                this.source,
                this.originalContext
            );
            this.observeItems();
            this.refreshAllViews();
        } else if (source === this.templateBinding) {
            this.template = this.templateBindingObserver.observe(
                this.source,
                this.originalContext
            );
            this.refreshAllViews(true);
        } else {
            this.updateViews(args);
        }
    }
    observeItems(force = false) {
        if (!this.items) {
            this.items = emptyArray;
            return;
        }
        const oldObserver = this.itemsObserver;
        const newObserver = (this.itemsObserver = Observable.getNotifier(this.items));
        const hasNewObserver = oldObserver !== newObserver;
        if (hasNewObserver && oldObserver !== null) {
            oldObserver.unsubscribe(this);
        }
        if (hasNewObserver || force) {
            newObserver.subscribe(this);
        }
    }
    updateViews(splices) {
        const childContext = this.childContext;
        const views = this.views;
        const totalRemoved = [];
        const bindView = this.bindView;
        let removeDelta = 0;
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            const removed = splice.removed;
            totalRemoved.push(
                ...views.splice(splice.index + removeDelta, removed.length)
            );
            removeDelta -= splice.addedCount;
        }
        const items = this.items;
        const template = this.template;
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            let addIndex = splice.index;
            const end = addIndex + splice.addedCount;
            for (; addIndex < end; ++addIndex) {
                const neighbor = views[addIndex];
                const location = neighbor ? neighbor.firstChild : this.location;
                const view =
                    totalRemoved.length > 0 ? totalRemoved.shift() : template.create();
                views.splice(addIndex, 0, view);
                bindView(view, items, addIndex, childContext);
                view.insertBefore(location);
            }
        }
        for (let i = 0, ii = totalRemoved.length; i < ii; ++i) {
            totalRemoved[i].dispose();
        }
        if (this.options.positioning) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                const currentContext = views[i].context;
                currentContext.length = ii;
                currentContext.index = i;
            }
        }
    }
    refreshAllViews(templateChanged = false) {
        const items = this.items;
        const childContext = this.childContext;
        const template = this.template;
        const location = this.location;
        const bindView = this.bindView;
        let itemsLength = items.length;
        let views = this.views;
        let viewsLength = views.length;
        if (itemsLength === 0 || templateChanged) {
            // all views need to be removed
            HTMLView.disposeContiguousBatch(views);
            viewsLength = 0;
        }
        if (viewsLength === 0) {
            // all views need to be created
            this.views = views = new Array(itemsLength);
            for (let i = 0; i < itemsLength; ++i) {
                const view = template.create();
                bindView(view, items, i, childContext);
                views[i] = view;
                view.insertBefore(location);
            }
        } else {
            // attempt to reuse existing views with new data
            let i = 0;
            for (; i < itemsLength; ++i) {
                if (i < viewsLength) {
                    const view = views[i];
                    bindView(view, items, i, childContext);
                } else {
                    const view = template.create();
                    bindView(view, items, i, childContext);
                    views.push(view);
                    view.insertBefore(location);
                }
            }
            const removed = views.splice(i, viewsLength - i);
            for (i = 0, itemsLength = removed.length; i < itemsLength; ++i) {
                removed[i].dispose();
            }
        }
    }
    unbindAllViews() {
        const views = this.views;
        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}
/**
 * A directive that configures list rendering.
 * @public
 */
export class RepeatDirective extends HTMLDirective {
    /**
     * Creates an instance of RepeatDirective.
     * @param itemsBinding - The binding that provides the array to render.
     * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(itemsBinding, templateBinding, options) {
        super();
        this.itemsBinding = itemsBinding;
        this.templateBinding = templateBinding;
        this.options = options;
        /**
         * Creates a placeholder string based on the directive's index within the template.
         * @param index - The index of the directive within the template.
         */
        this.createPlaceholder = DOM.createBlockPlaceholder;
        enableArrayObservation();
        this.isItemsBindingVolatile = Observable.isVolatileBinding(itemsBinding);
        this.isTemplateBindingVolatile = Observable.isVolatileBinding(templateBinding);
    }
    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    createBehavior(target) {
        return new RepeatBehavior(
            target,
            this.itemsBinding,
            this.isItemsBindingVolatile,
            this.templateBinding,
            this.isTemplateBindingVolatile,
            this.options
        );
    }
}
/**
 * A directive that enables list rendering.
 * @param itemsBinding - The array to render.
 * @param templateOrTemplateBinding - The template or a template binding used obtain a template
 * to render for each item in the array.
 * @param options - Options used to turn on special repeat features.
 * @public
 */
export function repeat(
    itemsBinding,
    templateOrTemplateBinding,
    options = defaultRepeatOptions
) {
    const templateBinding =
        typeof templateOrTemplateBinding === "function"
            ? templateOrTemplateBinding
            : () => templateOrTemplateBinding;
    return new RepeatDirective(itemsBinding, templateBinding, options);
}
