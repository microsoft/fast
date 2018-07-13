# FAST - Web Utilities
This package is a collection of utilities intended to be used with JSS (JavaScript Style Sheets) projects.

## Installation
`npm i --save @microsoft/fast-web-utilities`

## Usage

### DOM utilities

#### getKeyCode
The `getKeyCode` function gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events that still use the deprecated keyCode property.

```ts
import { getKeyCode } from "@microsoft/fast-web-utilities";

handleKeyPress = (e) => {
    let keyCode = getKeyCode(e);

    // Do something based on keyCode value
}
```

### HTML utilities

#### getClientRectWithMargin
The `getClientRectWithMargin` function gets the client bounding rectangle including any margins of an element.

```ts
import { getClientRectWithMargin } from "@microsoft/fast-web-utilities";

const itemWidth: number = getClientRectWithMargin(item).width;
const itemHeight: number = getClientRectWithMargin(item).height;
```

#### convertStylePropertyPixelsToNumber
The `convertStylePropertyPixelsToNumber` function will convert a property value from an elements computed style from pixels to a number value.

```ts
import { convertStylePropertyPixelsToNumber } from "@microsoft/fast-web-utilities";

const elementTopMargin: number = convertStylePropertyPixelsToNumber(style, "margin-top");
```

### Key code utilities

#### KeyCodes (enum)
```ts
import { KeyCodes } from "@microsoft/fast-web-utilities";

handleKeyPress = (e) => {
    const keyCode = getKeyCode(e);

    switch (keyCode) {
        case KeyCodes.space:
        case KeyCodes.enter:
            // Do something if keycode matches
            break;
    }
}
```

### String utilities

#### format
The `format` function builds a string from a format specifier and replacement parameters.

```ts
import { format } from "@microsoft/fast-web-utilities";

const formatterString: string = "View {0} {1}";

const newString: string = format(formatterString, "page", "4")); // "View page 4"
```

#### startsWith
The `startsWith` function checks to see if one string starts with another. The function is case sensitive.

```ts
import { startsWith } from "@microsoft/fast-web-utilities";

const matchIsFalse: string = startsWith("HelloWorld", "World"); // false
const matchIsTrue: string = startsWith("HelloWorld", "Hello"); // true
```

#### isNullOrWhiteSpace
The `isNullOrWhiteSpace` function determines if the specified string is undefined, null, empty, or whitespace. The function returns true if the value is undefined, null, empty, or whitespace, otherwise false.

```ts
import { isNullOrWhiteSpace } from "@microsoft/fast-web-utilities";

const myAnchor: HTMLElement = document.getElementById("#id");
const checkWhitespace: string = isNullOrWhiteSpace(myAnchor.href);
```

#### pascalCase
The `pascalCase` function converts a string to Pascal Case

```ts
import { pascalCase } from "@microsoft/fast-web-utilities";

const hyphenatedToPascal: string = pascalCase("my-string");
const uppercaseToPascal: string = pascalCase("MY STRING");
const whitespaceToPascal: string = pascalCase(" my string ");
```
