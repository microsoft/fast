# FAST application utilities
A list of any utilities commonly used by FAST applications.

## Localization
The isRTL utility determines if a string which should correspond to a language or language-locale is right to left.

```
import { isRTL } from "@microsoft/fast-application-utilities";

isRTL("en");
```

### Typescript enum
The Direction enum contains the ltr and rtl enum for use in a Typescript project.

```
import { Direction } from "@microsoft/fast-application-utilities";

let direction: Direction = Direction.ltr;
```