import { html, ref } from "@microsoft/fast-element";

export class StartEnd {
    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.startContainer.classList.toggle(
            "start",
            this.start.assignedNodes().length > 0
        );
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
    }
}

export const endTemplate = html<StartEnd>`
    <span name="end" part="end" ${ref("endContainer")}>
        <slot
            name="end"
            ${ref("end")}
            @slotchange=${x => x.handleEndContentChange()}
        ></slot>
    </span>
`;

export const startTemplate = html<StartEnd>`
    <span name="start" part="start" ${ref("startContainer")}>
        <slot
            name="start"
            ${ref("start")}
            @slotchange=${x => x.handleStartContentChange()}
        ></slot>
    </span>
`;
