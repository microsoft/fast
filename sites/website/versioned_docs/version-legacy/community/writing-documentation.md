---
id: writing-documentation
title: Writing documentation
sidebar_label: Writing documentation
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/community/writing-documentation.md
description: Thank you for your interest in contributing to our documentation. We put together this guide to help you get started.
keywords:
  - contributing
  - writing documentation
---

Thank you for your interest in contributing to our documentation. We put together this guide to help you get started, whether you want to fix minor spelling/grammar issues or have a more ambitious goal to write a new article.

## Documentation types

There are two types of documentation: articles and API references. Articles are documents that use [GitHub-flavored Markdown syntax](https://github.github.com/gfm/) located in our packages. API references include details such as classes and methods and are located within the code they describe.

## Writing articles

Each article begins with a YAML metadata block followed by a body written with [GitHub-flavored Markdown syntax](https://github.github.com/gfm/). The YAML metadata block provides key information needed by our documentation system. Here's an example of this document's YAML metadata block:

```yaml
---
id: writing-documentation
title: Writing Documentation
sidebar_label: Writing Documentation
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/community/writing-documentation.md
---
```

The required fields are:

* **id**: A human-readable unique ID used in the document URL.
* **title**: The title displayed at the top of the document.
* **sidebar_label**: The label displayed in the table of contents.
* **custom_edit_url**: A URL where the document source can be edited.

Beneath the YAML metadata block, the article's body is written with [GitHub-flavored Markdown syntax](https://github.github.com/gfm/). Since our documentation system will turn the `title` metadata into the article header, the content should begin with a short introductory paragraph, followed by an h2 header for each section of the document. You may use h3 headers beneath h2 headers but avoid deeper sub-sections.

In addition to [GitHub-flavored Markdown syntax](https://github.github.com/gfm/), you may use the admonitions `note`, `tip`, `important`, `caution`, and `warning`. Here's an example of the syntax for a `note`:

```markdown
:::note

This is a note

:::
```

Which is rendered as:

:::note

This is a note

:::

## Writing API references

An API reference is written inline with code using TSDoc syntax. [TSDoc](https://github.com/microsoft/tsdoc) is a proposal to standardize documentation comments used in TypeScript source files. It allows tools to extract content from comments without getting confused by differing syntax. The TSDoc notation should be familiar:

```ts
export class Statistics {
  /**
   * Returns the average of two numbers.
   *
   * @remarks
   * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
   *
   * @param x - The first input number
   * @param y - The second input number
   * @returns The arithmetic mean of `x` and `y`
   *
   * @beta
   */
  public static getAverage(x: number, y: number): number {
    return (x + y) / 2.0;
  }
}
```

## Building and testing the docs

To test documentation changes, clone and build the documentation as described in [the contributor guide](./contributor-guide.md). Next, open a terminal and navigate to `sites/website` and run the documentation site with `yarn start`. This will allow you to preview the site at `localhost:3000` and validate that your changes are rendering.

## Style guide

Writing guidelines for this project come from the [Chicago Manual of Style][CMoS] and [The Associated Press Stylebook][APS]. If these two publications have conflicting guidance, the Chicago Manual of Style guidance is preferred.

We recognize that our contributors may not have access to these resources, so we provide a *style guide amendment* that covers common issues and guidance specific to this project, or guidance that is not specified in other guides.

For guidance not specified by this amendment, several free resources can be used as a supplement:

* [The National Geographic style manual][NGSM]
* [The Guardian and Observer style guide][GaOSG]
* [The BBC News style guide][TBNS]

## Style guide amendment

### Punctuation

**Parentheses with periods**: When a complete sentence is inside of parentheses, place the period inside the ending parenthesis. If the words are not a complete sentence the period or other punctuation goes on the outside.

A complete sentence in parenthesis:

> (The first time it said 'hello world,' I knew we would be friends.)

A sentence fragment in parenthesis:

> The first time it said 'hello world,' I knew we would be friends (and we still are).

**Quotation marks with periods**: When a sentence ends with a quotation mark, the period goes on the inside. The only exception to this rule is cases where the quotation marks are around text intended to be input by the user, but in these cases, use `code` formatting.

>The boy said, "The first time it said 'hello world,' I knew we would be friends."
>At the prompt, type `hello world`.

**Colons on sentences**: When a sentence proceeds and is describing or introducing a code block, list or example; use a colon.

Code block:

> To run the script, type:
> ```bash
> run hello-world
> ```

List:

> It has said the following:
> * hello world

Example:

> An example of how to format phrases it can say:
> > Hello world
> > Hello world!
> > Hello world?

**Periods on sentences**: Except for a sentence proceeding a code block, list, or example; end all complete sentences with a period including sentences in code comments and list items.

Code comment:

> ```javascript
>  // Update this string to change what it will say.
>  
>  alert("hello world");
> ```

List:

> Over the years, I have had a few computers say 'hello world' to me:
> * The first was a CBM 8032 I received for my 12th birthday.

### Headings

**Sentence case headings**: Headings formatted in sentence case. The exception is proper names and acronyms that are capitalized.

*Heading in sentence case:*

> #### My first computer

*Heading with acronym:*

> #### My first CBM 8032

*Heading with proper name:*

> #### My first Commodore

**Punctuation on headings**: Do not put periods on headings and avoid headings that are questions or complete sentences.

### References

**HTML elements**: When referencing HTML elements, use the element syntax inside angle brackets with the word 'element' or 'elements' in context. Include a link to the MDN documentation for the element:

> Use an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) element for hypertext.

> The elements [`<b>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b) and [`<strong>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong) are not equivalent.

**UI text**: When referencing text in a UI such as a name in a button or menu item, use **bold** formatting:

> Click the **submit** button.

**Named objects**: When referencing named objects such as other components or packages, use *italic* formatting with a descriptive word such as "component" in context:

> Use the *button* component.

**Code**: When referencing code, console commands, or file names; use `code` formatting:

> Type `npm start` in the console.

> Use the `fast-element` package.

> The `console.log()` method outputs a message to the console.

### Markdown

**Element spacing**: Use one line break between markdown elements.

For example, between headings, paragraphs, code fences, and images:

```markdown
## Heading 1

Paragraph

* List 1
* List 2

## Heading 2

![Image](https://image.url)
```

**Trailing space**: Remove trailing spaces at the end of elements. Include one new line character at the end of the markdown file.

**Unordered lists**: Use `*` syntax for un-ordered lists:

> ```markdown
> Technologies used:
>
> * TypeScript
> * React
> * JSS
> ```

### Code

**Code fence languages**: Provide a language for code fences:

Example CSS code fence:

````markdown
 ```css
 .selector {
     background: white;
 }
 ```
````

You can find a list of supported languages [here](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml).

**Testing examples**: Test your code examples to verify they work.

**Code guidelines**: Verify that code examples follow the project's coding guidelines. For example, four spaces for indenting.

#### Code comments

Code comments can be fragments or complete sentences. Depending on the format, there are slightly different guidelines.

Code comments in **sentence** format:

* Can be formatted as a single line or multi-line syntax.
* Have a period or question mark at the end.

Code comments in **fragment** format:

* Are formatted as single-line syntax.
* Do *not* have period or question mark at the end.

[CMoS]: https://www.amazon.com/Chicago-Manual-Style-16th/dp/0226104206/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=2QG7JEGM9PVNQJR5V00Y

[APS]: https://www.amazon.com/Associated-Press-Stylebook-2018-ebook-dp-B07DJBHCKP/dp/B07DJBHCKP/ref=mt_kindle?_encoding=UTF8&me=&qid=1546304954

[NGSM]: https://sites.google.com/a/ngs.org/ngs-style-manual/home/C/computer-terms

[GaOSG]: https://www.theguardian.com/guardian-observer-style-guide-a

[TBNS]: https://www2.media.uoa.gr/lectures/linguistic_archives/academic_papers0506/notes/stylesheets_3.pdf
