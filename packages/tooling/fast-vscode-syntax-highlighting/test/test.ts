// Typechecking is disabled since this file isn't intended to be compiled
/* eslint-disable */
//@ts-nocheck

`regular literals are ${unaffected}`;

html<MyElement>`
    <template @bind="${x => x.someBinding}">
        <slot ${slotted("element")}></slot>
        ${when(
            x => x.isTrue,
            html<MyElement>`
                <div>
                    ${repeat(
                        x => x.list,
                        html<ListItem, MyElement>`
                            <li>${item => item.name(something as Typed)}</li>
                            <li title="${item => item.name(something as Typed)}"></li>
                        `
                    )}
                </div>
            `
        )}
    </template>
`;

html<SomeComponent>`
<${context.tagFor(SomeElement)}
    class="my-element"
    @change="${(x, c) => x.changeHandler(c.event as CustomEvent)}"
    value="${x => x.someArray[0]}"
></${context.tagFor(SomeElement)}>`;

html`<${context.tagFor(Component)} class="component"></${context.tagFor(Component)}>`;

html<Typed>`
    <div prop="${x => (x.prop ? "hi" : "hello")}"></div>
`;

// expression as attribute value
html<Typed>`
    <div prop="${x => (x.prop ? "hi" : "hello")}"></div>
`;
html<Typed>`
    <div @prop=${x => (x.prop ? "hi" : "hello")}></div>
`;

// expression as direct attribute
html<Typed>`
    <div ${x => (x.val ? "attr" : "")}></div>
`;

// expression as element content
html<Typed>`
    <div>${x => x.content}</div>
`;

// extra stuff in the type
html<typeof MyElement>`
    <template></template>
`;
html<TBase, any>`
    <div></div>
`;

// should not match
let a = `${something}.html`;
a = `something else`;

/* CSS */

// empty string
css``;
// blankspace-only string

css``;

// basic selectors
css`
    div #id .class[attribute] {
    }
`;

// property interpolation
css`
    a {
        color: ${someColor};
    }
`;
css`
    a {
        ${interpolatedList}
    }
`;
css`
    a {
        ${propertyName}: "value";
    }
`;

// selector interpolation
css`
    ${someSelector} {
    }
`;
css`
    [${someAttr.name}="value"] {
    }
`;
css`[${someAttr.full}] {}`;
css`
    #${someId} .${someClass} {
    }
`;

css`[name="${someSelector}"] {}`;
css`a:${someSelector} {}`;
css`
    a:not(${someSelector}) {
    }
`;

css`
/* ${invalid} */
.asdf {
    /* color: ${invalid}; */
}
`;

css`
    :root {
        ${behavior.propertyName}: #000;
        background-image: url("strings ${within.Strings?.work}");
    }
    :host(.my-element) {
        color: ${behavior.var};
        height: calc(${heightNumber} * 1px);
    }
`;

css`
    div {
    }
`.withBehaviors(
    behavior,
    forcedColorsStylesheetBehavior(
        css`
            #selector:${pseudoSelector}::before {
                color: ${SystemColors.Highlight};
                line-height: 2;
            }
        `
    )
);

css`
    ${context.tagFor(Component)} {
        color: ${tokenValue};
    }
`;

/* Comment-style */

/* html */ `<div></div>`;
/*             html                */                   `<div></div>`;
/*html*/`<div></div>`;
/* html<TBase, any> */ `<div></div>`;
/*           html            */ `<div></div>`;

/* css */ `.css {}`;
/*css*/`.css {}`;
/*              css          */               `.css {}`;
/* css */ `.${exp} {}`;


/* should not match */
let b = `${something}.css`;
b = `something else`;

/* html */ 'asdf' + `<template></template>`;

/* html */
`<template></template>`;

/* css */
`.class {}`;

/* css */ 'asdf' + `.class {}`;
