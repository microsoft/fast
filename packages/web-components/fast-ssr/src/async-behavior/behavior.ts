import { Behavior, Constructable, FASTElement } from "@microsoft/fast-element";

export interface AsyncBehavior extends Behavior {
    ready: Promise<any>;
}

const asyncRenderBehaviors = new WeakSet<Constructable<AsyncBehavior>>();
export function asyncRender(source: Constructable<AsyncBehavior>) {
    asyncRenderBehaviors.add(source);
}

export function getAsyncBehaviors(target: FASTElement): null | AsyncBehavior[] {
    const behaviors = target.$fastController.behaviors;
    if (behaviors == null) {
        return null;
    } else {
        return Array.from(behaviors).filter(behavior =>
            asyncRenderBehaviors.has(Object.getPrototypeOf(behavior).constructor)
        ) as AsyncBehavior[];
    }
}
