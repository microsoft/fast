# FAST Web utilities

This package is a collection of utilities intended to be used for web projects.

## Installation

`npm i --save @microsoft/fast-web-utilities`

## Usage

### DOM utilities

#### getKeyCode

The `getKeyCode` function gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events that still use the deprecated keyCode property.

```js
import { getKeyCode } from "@microsoft/fast-web-utilities";

handleKeyPress = (e) => {
    let keyCode = getKeyCode(e);

    // Do something based on keyCode value
}
```

### HTML utilities

#### getClientRectWithMargin

The `getClientRectWithMargin` function gets the client bounding rectangle including any margins of an element.

```js
import { getClientRectWithMargin } from "@microsoft/fast-web-utilities";

const itemWidth = getClientRectWithMargin(item).width;
const itemHeight = getClientRectWithMargin(item).height;
```

#### convertStylePropertyPixelsToNumber

The `convertStylePropertyPixelsToNumber` function will convert a property value from an elements computed style from pixels to a number value.

```js
import { convertStylePropertyPixelsToNumber } from "@microsoft/fast-web-utilities";

const elementTopMargin = convertStylePropertyPixelsToNumber(style, "margin-top");
```

### Key utilities

#### Key strings

Commonly used `event.key` values are available as individual exports. Additional `key` values will be added as needed.  

```js
import { keyEnter, keySpace } from "@microsoft/fast-web-utilities";

handleKeyPress = (e) => {
    switch (e.key) {
        case keySpace:
        case keyEnter:
            // Do something if key matches
            break;
    }
}
```

#### KeyCodes (enum)

Keycodes are deprecated and their use should be avoided. Use the individual string `key` values instead.

### Localization utilities

#### Typescript enum

The `Direction` enum contains the `ltr` and `rtl` enum for use in a Typescript project.

```typescript
import { Direction } from "@microsoft/fast-web-utilities";

let direction: Direction = Direction.ltr;
```

### Number utilities

#### Limit

The `limit` function ensures that a value is between a min and max value. If the value is lower than min, min will be returned. If the value is greater than max, max will be retured.

```js
import { limit } from "@microsoft/fast-web-utilities";
const incomingNumber; // 11 
const setNumberByLimit = limit(0, 10, incomingNumber); // returns 10
```

#### wrapInBounds

The `wrapInBounds` function keeps a given value within the bounds of a min and max value. If the value is larger than the max, the minimum value will be returned. If the value is smaller than the minimum, the maximum will be returned. Otherwise, the value is returned un-changed.

```js
import { wrapInBounds } from "@microsoft/fast-web-utilities";
const slides; // 5
const index; // 5
const activeIndex = wrapInBounds(0, this.slides.length - 1, index) // returns 0
```

### String utilities

#### Format

The `format` function builds a string from a format specifier and replacement parameters.

```js
import { format } from "@microsoft/fast-web-utilities";

const formatterString = "View {0} {1}";

const newString = format(formatterString, "page", "4")); // "View page 4"
```

#### startsWith

The `startsWith` function checks to see if one string starts with another. The function is case sensitive.

```js
import { startsWith } from "@microsoft/fast-web-utilities";

const matchIsFalse = startsWith("HelloWorld", "World"); // false
const matchIsTrue = startsWith("HelloWorld", "Hello"); // true
```

#### isNullOrWhiteSpace

The `isNullOrWhiteSpace` function determines if the specified string is undefined, null, empty, or whitespace. The function returns true if the value is undefined, null, empty, or whitespace, otherwise false.

```js
import { isNullOrWhiteSpace } from "@microsoft/fast-web-utilities";

const myAnchor = document.querySelector("#id");
const checkWhitespace = isNullOrWhiteSpace(myAnchor.href);
```

#### pascalCase

The `pascalCase` function converts a string to Pascal Case

```js
import { pascalCase } from "@microsoft/fast-web-utilities";

const hyphenatedToPascal = pascalCase("my-string");
const uppercaseToPascal = pascalCase("MY STRING");
const whitespaceToPascal = pascalCase(" my string ");
```

#### classNames
A utility for merging class names into a single string conditionally. Accepts any number of strings, functions that return strings and two index arrays where the first index is a string or function that returns a string, and the second index is a boolean.

```js
import { classNames } from "@microsoft/fast-web-utilities";

// evaluates to "classOne classTwo classThree classFive"
const myJoinedClassNames = classNames(
    "classOne",
    () => "classTwo",
    ["classThree", true],
    ["classFour", false]
    [() => "classFive", true],
    [() => "classSix", false]
)
```
