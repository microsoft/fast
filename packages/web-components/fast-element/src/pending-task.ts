/**
 * Implementation of the https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/pending-task.md proposal.
 * @beta
 */
export class PendingTaskEvent extends Event {
    constructor(public complete: Promise<void>) {
        super("pending-task", { bubbles: true, composed: true });
    }
}
