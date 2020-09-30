import { NavigationCommand } from "./commands";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { NavigationContributor, NavigationPhase } from "./contributions";

type NavigationAction = () => Promise<void>;

export interface NavigationAttempt<TSettings = any> {
    readonly route: RecognizedRoute<TSettings>;
    runLifecycle(
        participants: readonly NavigationContributor<TSettings>[]
    ): Promise<boolean>;
    deny(callback?: NavigationAction): void;
    allow(callback?: NavigationAction): void;
}

export class NavigationTransaction<TSettings = any>
    implements NavigationAttempt<TSettings> {
    private allowed = true;
    private allowActions: NavigationAction[] = [];
    private denyActions: NavigationAction[] = [];
    private currentPhase: NavigationPhase = "tryEnter";

    constructor(
        public readonly owner: Router,
        private config: RouterConfiguration<TSettings>,
        public readonly route: RecognizedRoute<TSettings>,
        public readonly command: NavigationCommand
    ) {}

    public createChild(
        owner: Router,
        config: RouterConfiguration<TSettings>,
        route: RecognizedRoute<TSettings>,
        command: NavigationCommand
    ): NavigationTransaction<TSettings> {
        const child = Object.create(this);
        child.owner = owner;
        child.config = config;
        child.route = route;
        child.command = command;
        return child;
    }

    public deny(callback?: NavigationAction): void {
        this.allowed = false;

        console.log("deny");

        if (callback) {
            this.denyActions.push(callback);
        }
    }

    public allow(callback?: NavigationAction): void {
        console.log("allow");
        if (callback) {
            this.allowActions.push(callback);
        }
    }

    public async tryLeave(): Promise<boolean> {
        this.currentPhase = "tryLeave";

        if (!(await this.runLifecycle(this.config.contributors))) {
            return false;
        }

        await this.owner.tryLeave(this);

        return this.allowed;
    }

    public async tryEnter(): Promise<boolean> {
        this.currentPhase = "tryEnter";

        if (!(await this.runLifecycle(this.config.contributors))) {
            return false;
        }

        await this.owner.tryEnter(this);

        return this.allowed;
    }

    public async runLifecycle(participants: readonly NavigationContributor<TSettings>[]) {
        const phase = this.currentPhase;

        console.log(`${this.currentPhase}`, participants);

        for (const p of participants) {
            if (phase in p) {
                await p[phase]!(this);
            }

            if (!this.allowed) {
                return false;
            }
        }

        return true;
    }

    public async run() {
        console.log("executing command", this.command);
        await this.command.execute(this);

        if (this.allowed) {
            for (let action of this.allowActions) {
                await action();
            }
        } else {
            for (let action of this.denyActions) {
                await action();
            }
        }
    }
}
