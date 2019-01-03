---
id: writing-style-guide
title: Writing style guide
sidebar_label: Writing style guide
---

# Writing style guide

Most writing guidelines used for this project come from the [Chicago Manual of Style][CMoS] and [The Associated Press Stylebook][APS]. When these two publications have conflicting guidance, the Chicago Manual of Style is usually preferred.

We recognize that many of our contributors may not have access to these paid resources, so we provide a *style guide amendment* that covers many of the most common issues as well as some guidance that is different for this project, or is not covered in other guides.

For guidance not covered by this amendment, several free resources can be used as a supplement:

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

**Quotation marks with periods**: When a sentence ends with a quotation mark, the period goes on the inside. The only exception to this rule in cases where the quotation marks are around text intended to be input by the user, but in these cases, use `code` formatting.

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

> Over the years, I have had a few say 'hello world' to me:
> * The first was a CBM 8032 I received for my 12th birthday.

### Headings

**Page heading**: Start all pages with a level 1 heading.

Markdown:

```markdown
# My first computer
```

HTML:

```HTML
<h1>My first computer</h1>
```

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

> Use the `fast-animation` package.

> The `console.log()` method outputs a message to the console.

### Markdown

**Element spacing**: Use one line break between markdown elements.

For example, between headings, paragraphs, code fences, and images:

```markdown
# Heading 1

Paragraph

* List 1
* List 2

## Heading 2

![Image](https://image.url)
```

**Trailing space**: Remove trailing spaces at the end of elements and do not include an extra line break at the end of the markdown file.

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

**Testing examples**: Test your code examples to verify they are working as expected.

**Code guidelines**: Verify that code examples follow the projects coding guidelines. For example, four spaces for indenting.

#### Code comments

Code comments can be fragments or complete sentences. Depending on the format, there are slightly different guidelines.

Code comments in **sentence** format:

* Can be formatted as a single line or multi-line syntax.
* Have periods or question marks at the end.

Code comments in **fragment** format:

* Are formatted as single line syntax.
* Do *not* have periods or question marks at the end.

[CMoS]: https://www.amazon.com/Chicago-Manual-Style-16th/dp/0226104206/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=2QG7JEGM9PVNQJR5V00Y

[APS]: https://www.amazon.com/Associated-Press-Stylebook-2018-ebook-dp-B07DJBHCKP/dp/B07DJBHCKP/ref=mt_kindle?_encoding=UTF8&me=&qid=1546304954

[NGSM]: https://sites.google.com/a/ngs.org/ngs-style-manual/home/C/computer-terms

[GaOSG]: https://www.theguardian.com/guardian-observer-style-guide-a

[TBNS]: http://www2.media.uoa.gr/lectures/linguistic_archives/academic_papers0506/notes/stylesheets_3.pdf