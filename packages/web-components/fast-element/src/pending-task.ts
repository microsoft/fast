/**
 * This module provides an implementation of the https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/pending-task.md proposal.
 */
export interface PendingTask extends Event {
    complete: Promise<void>;
}

/**
 * @beta
 */
export class PendingTaskEvent extends Event implements PendingTask {
    public static readonly type = "pending-task";
    constructor(public complete: Promise<void>) {
        super(PendingTaskEvent.type, { bubbles: true, composed: true });
    }

    public static isPendingTask<T extends Event>(
        value: T | PendingTask
    ): value is PendingTask {
        return (
            value.type === PendingTaskEvent.type &&
            typeof (value as any).complete?.then === "function"
        );
    }
}
