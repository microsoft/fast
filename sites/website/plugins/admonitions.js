/**
 * Custom markdown-it plugin for Docusaurus-style admonition blocks.
 *
 * Parses fenced blocks like:
 *   :::tip
 *   Content here (supports inline markdown).
 *   :::
 *
 * Renders them as styled alert divs using the existing Docusaurus CSS classes.
 */

const admonitionTypes = {
  tip: "alert--success",
  note: "alert--secondary",
  warning: "alert--warning",
  important: "alert--info",
};

const admonitionOpen = /^:::(\w+)\s*$/;
const admonitionClose = /^:::\s*$/;

function buildAdmonitionTokens(state, type, bodyContent) {
  const cssClass = admonitionTypes[type];
  const heading = type.charAt(0).toUpperCase() + type.slice(1);

  const open = new state.Token("html_block", "", 0);
  open.content = `<div class="alert ${cssClass}">\n<div class="alert__heading">${heading}</div>\n`;

  const tokens = [open];

  if (bodyContent) {
    const bodyOpen = new state.Token("paragraph_open", "p", 1);
    const bodyInline = new state.Token("inline", "", 0);
    bodyInline.content = bodyContent;
    bodyInline.children = [];
    const bodyClose = new state.Token("paragraph_close", "p", -1);
    tokens.push(bodyOpen, bodyInline, bodyClose);
  }

  const close = new state.Token("html_block", "", 0);
  close.content = "</div>\n";
  tokens.push(close);

  return tokens;
}

export function admonitionPlugin(md) {
  md.core.ruler.after("block", "admonition", (state) => {
    const tokens = state.tokens;

    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];

      if (token.type !== "paragraph_open") {
        continue;
      }

      const inline = tokens[i + 1];
      if (!inline || inline.type !== "inline") {
        continue;
      }

      const lines = inline.content.split("\n");
      const openMatch = lines[0].match(admonitionOpen);

      if (!openMatch) {
        continue;
      }

      const type = openMatch[1];
      if (!(type in admonitionTypes)) {
        continue;
      }

      // Find the closing ::: — could be in this same inline token or a later one.
      let closeLineIndex = lines.findIndex((l, idx) => idx > 0 && admonitionClose.test(l));

      if (closeLineIndex !== -1) {
        // Opening and closing are in the same paragraph block.
        const body = lines.slice(1, closeLineIndex).join("\n").trim();
        const after = lines.slice(closeLineIndex + 1).join("\n").trim();

        const replacements = buildAdmonitionTokens(state, type, body);

        if (after) {
          // Leftover content after the closing ::: stays as a paragraph.
          const pOpen = new state.Token("paragraph_open", "p", 1);
          const pInline = new state.Token("inline", "", 0);
          pInline.content = after;
          pInline.children = [];
          const pClose = new state.Token("paragraph_close", "p", -1);
          replacements.push(pOpen, pInline, pClose);
        }

        // Replace paragraph_open + inline + paragraph_close
        tokens.splice(i, 3, ...replacements);
        continue;
      }

      // The closing ::: is in a subsequent token — scan forward.
      let found = false;

      for (let j = i + 3; j < tokens.length; j++) {
        if (tokens[j].type !== "inline") {
          continue;
        }

        const jLines = tokens[j].content.split("\n");
        closeLineIndex = jLines.findIndex((l) => admonitionClose.test(l));

        if (closeLineIndex === -1) {
          continue;
        }

        // Collect body: remainder of the opening paragraph + all paragraphs in between + content before :::
        const bodyParts = [];

        const openRemainder = lines.slice(1).join("\n").trim();
        if (openRemainder) {
          bodyParts.push(openRemainder);
        }

        // Gather inline content from paragraphs between the opener and this closer.
        for (let k = i + 3; k < j; k++) {
          if (tokens[k].type === "inline") {
            bodyParts.push(tokens[k].content);
          }
        }

        const closeRemainder = jLines.slice(0, closeLineIndex).join("\n").trim();
        if (closeRemainder) {
          bodyParts.push(closeRemainder);
        }

        const body = bodyParts.join("\n\n");
        const after = jLines.slice(closeLineIndex + 1).join("\n").trim();

        const replacements = buildAdmonitionTokens(state, type, body);

        if (after) {
          const pOpen = new state.Token("paragraph_open", "p", 1);
          const pInline = new state.Token("inline", "", 0);
          pInline.content = after;
          pInline.children = [];
          const pClose = new state.Token("paragraph_close", "p", -1);
          replacements.push(pOpen, pInline, pClose);
        }

        // Replace from opening paragraph_open through the closer's paragraph_close.
        const closeParaClose = j + 1; // paragraph_close after the inline containing :::
        tokens.splice(i, closeParaClose - i + 1, ...replacements);
        found = true;
        break;
      }

      if (!found) {
        // No closing ::: found — leave content as-is.
        continue;
      }
    }
  });
}
