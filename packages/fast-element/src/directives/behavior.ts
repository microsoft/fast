export interface Behavior {
    bind(source: unknown): void;
    unbind(): void;
}

export class CompositeBehavior implements Behavior {
    constructor(private behaviors: Behavior[]) {}

    bind(source: unknown) {
        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].bind(source);
        }
    }

    unbind() {
        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }
    }
}

export interface BehaviorFactory {
    createBehavior(target: any): Behavior;
}

export class CompositeBehaviorFactory implements BehaviorFactory {
    public readonly factories: BehaviorFactory[];

    constructor(...factories: BehaviorFactory[]) {
        this.factories = factories;
    }

    createBehavior(target: any): Behavior {
        const factories = this.factories;
        const behaviors = new Array(this.factories.length);

        for (let i = 0, ii = factories.length; i < ii; ++i) {
            behaviors[i] = factories[i].createBehavior(target);
        }

        return new CompositeBehavior(behaviors);
    }
}
