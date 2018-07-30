# FAST - JSS Utilities
This package is a collection of utilities intended to be used with JSS (JavaScript Style Sheets) projects.

## Installation
`npm i --save @microsoft/fast-jss-utilities`

## Usage

### Direction
The `Direction` is an enum which can be either ltr or rtl.

```ts
import { Direction } from "@microsoft/fast-jss-utilities";

const direction = Direction.ltr;
```

### localizeSpacing
The `localizeSpacing` function should be used in conjuction with `Direction` to switch the spacing on a padding or margin.

```ts
import { Direction, localizeSpacing } from "@microsoft/fast-jss-utilities";

const styles = {
    button: {
        padding: localizeSpacing(Direction.ltr)("8px 8px 12px 12px")
    }
};
```

### applyLocalizedProperty
The `applyLocalizedProperty` function will swap the strings for the property based on the `Direction`.

```ts
import { Direction, applyLocalizedProperty } from "@microsoft/fast-jss-utilities";

const styles = {
    button: {
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0"
    }
};
```

### toPx
The `toPx` function transforms a number to a string appended with `px`.

```ts
import { toPx } from "@microsoft/fast-jss-utilities";

const styles = {
    button: {
        padding: toPx(5)
    }
};
```

### applyMaxLines
The `applyMaxLines` function is used whenever there is a limit on the number of lines shown. It takes two parameters, the number of lines and the line-height in px.

```ts
import { applyMaxLines } from "@microsoft/fast-jss-utilities";

const styles = {
    button: {
        ...applyMaxLines(2, 24)
    }
};
```

### applyScreenReader
The `applyScreenReader` function should be used whenever there is an item that is hidden from a sighted user but visible to screen readers.

```ts
import { applyScreenReader } from "@microsoft/fast-jss-utilities";

const styles = {
    label: {
        ...applyScreenReader()
    }
};
```

### ellipsis
The `ellipsis` function will create the standard CSS needed to give an element with text an ellipsis.

```ts
import { ellipsis } from "@microsoft/fast-jss-utilities";

const styles = {
    label: {
        ...ellipsis()
    }
};
```

### applyAcrylic
The `applyAcrylic` function can be used to create a partially transparent texture for the background of a specific element or UI surface.

```ts
import { applyAcrylic } from "@microsoft/fast-jss-utilities";

const acrylicConfig: IAcrylicConfig = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    fallbackBackgroundColor: "#000000",
    blurRadius: "20px",
    saturation: "112%",
}

const styles = {
    backgroundElement: {
        ...applyAcrylic<IDesignSystem>(acrylicCofig)
    }
};
```