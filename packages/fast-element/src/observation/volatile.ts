import { type Accessor, Observable } from "./observable.js";

/**
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
export function volatile(
    target: {},
    name: string | Accessor,
    descriptor: PropertyDescriptor,
): PropertyDescriptor {
    return Object.assign({}, descriptor, {
        get(this: any) {
            Observable.trackVolatile();
            return descriptor.get!.apply(this);
        },
    });
}
