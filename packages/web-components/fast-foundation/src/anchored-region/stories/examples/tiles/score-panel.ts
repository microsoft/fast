import {
    FASTElement,
    observable,
    ref,
    repeat,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { css, ElementViewTemplate, html } from "@microsoft/fast-element";
import type { Orientation } from "@microsoft/fast-web-utilities";
import { FASTMenu, FASTMenuItem, FASTTooltip } from "../../../../index.js";
import type { ARTile } from "./ar-tile.js";
import type { GameState } from "./interfaces.js";

export function registerScorePanel() {
    ScorePanel.define({
        name: "score-panel",
        template: scorePanelTemplate(),
        styles: scorePanelStyles,
    });
}

export interface ScoreWord {
    word: string;
    tiles: ARTile[];
    value: number;
    orientation: Orientation;
    isValid?: boolean;
}

/**
 *
 *
 * @public
 */
export class ScorePanel extends FASTElement {
    @observable
    public horizontalWords: ScoreWord[] = [];

    @observable
    public verticalWords: ScoreWord[] = [];

    @observable
    public bestGame: GameState;

    public wordDisplay: FASTMenu;
    public menuTooltip: FASTTooltip;

    private currentHiliteWord: ScoreWord | undefined;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public handleMenuItemMouseEnter = (e: MouseEvent, scoreWord: ScoreWord): void => {
        if (e.target instanceof FASTMenuItem) {
            this.menuTooltip.anchorElement = e.target;
        }
        this.hiliteWord(scoreWord);
    };

    public handleMenuItemMouseLeave = (e: MouseEvent, scoreWord: ScoreWord): void => {
        this.unhiliteWord(scoreWord);
    };

    public handleMenuItemFocusIn = (e: MouseEvent, scoreWord: ScoreWord): void => {
        if (e.target instanceof FASTMenuItem) {
            this.menuTooltip.anchorElement = e.target;
        }
        this.hiliteWord(scoreWord);
    };

    public handleMenuItemFocusOut = (e: MouseEvent, scoreWord: ScoreWord): void => {
        this.unhiliteWord(scoreWord);
    };

    private hiliteWord(scoreWord: ScoreWord): void {
        if (this.currentHiliteWord) {
            this.unhiliteWord(this.currentHiliteWord);
        }
        this.currentHiliteWord = scoreWord;
        scoreWord.tiles.forEach(tile => {
            tile.classList.toggle("hilite", true);
        });
    }

    private unhiliteWord(scoreWord: ScoreWord): void {
        if (scoreWord !== this.currentHiliteWord) {
            return;
        }
        scoreWord.tiles.forEach(tile => {
            tile.classList.toggle("hilite", false);
        });
        this.currentHiliteWord = undefined;
    }
}

const scoreWordTemplate: ViewTemplate<ScoreWord> = html`
    <fast-menu-item
        @mouseenter="${(x, c) =>
            c.parent.handleMenuItemMouseEnter(c.event as MouseEvent, x)}"
        @mouseleave="${(x, c) =>
            c.parent.handleMenuItemMouseLeave(c.event as MouseEvent, x)}"
        @focusin="${(x, c) => c.parent.handleMenuItemFocusIn(c.event as MouseEvent, x)}"
        @focusout="${(x, c) => c.parent.handleMenuItemFocusOut(c.event as MouseEvent, x)}"
        class="
            score-word-option
            ${x =>
            x.isValid === true ? "valid" : x.isValid === false ? "invalid" : void 0}
        "
    >
        <div class="score-word-display">
            <div class="score-word-word">
                ${x => x.word}
            </div>
            <div class="score-word-score">
                ${x => x.value}
            </div>
        </div>
    </fast-menu-item>
`;

/**
 * The template
 * @public
 */
export function scorePanelTemplate<T extends ScorePanel>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            ${when(
                x => x.bestGame,
                html`
                    <fast-button
                        class="best-game-button valid"
                        @click="${x => x.$emit("loadbestgame")}"
                    >
                        Your Best: ${x => x.bestGame.score}
                    </fast-button>
                `
            )}
            <fast-menu class="score-word-listbox">
                <h4>
                    Horizontal Words
                </h4>
                ${repeat(x => x.horizontalWords, scoreWordTemplate)}
                <h4>
                    Vertical Words
                </h4>
                ${repeat(x => x.verticalWords, scoreWordTemplate)}
            </fast-menu>
            <fast-tooltip auto-update-mode="auto" ${ref("menuTooltip")}>
                BOO
            </fast-tooltip>
        </template>
    `;
}

export const scorePanelStyles = css`
    :host {
    }

    .valid {
        background: green;
    }

    .invalid {
        background: red;
    }

    .score-word-listbox {
        width: 100%;
        min-height: 30px;
    }

    .score-word-option {
        height: 30px;
        width: 100%;
    }

    .score-word-option {
        height: 30px;
        width: 100%;
    }

    .score-word-option::part(content) {
        width: 100%;
    }

    .score-word-display {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
    }

    .score-word-word {
        grid-column: 1;
        grid-row: 1;
    }

    .score-word-score {
        grid-column: 2;
        grid-row: 1;
    }
`;
